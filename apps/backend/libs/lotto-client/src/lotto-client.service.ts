import { Injectable } from '@nestjs/common'
import { fromURL } from 'cheerio'
import { isTag, isText } from 'domhandler'
import { DateExtraction, WeeklyPrizeModel } from './interfaces'

const monthMap = {
	มกราคม: 1,
	กุมภาพันธ์: 2,
	มีนาคม: 3,
	เมษายน: 4,
	พฤษภาคม: 5,
	มิถุนายน: 6,
	กรกฎาคม: 7,
	สิงหาคม: 8,
	กันยายน: 9,
	ตุลาคม: 10,
	พฤศจิกายน: 11,
	ธันวาคม: 12,
} as const

const dateAfterChangeFormat = new Date('2000-04-01').getTime()
const baseUrl = 'https://www.myhora.com'

@Injectable()
export class LottoClientService {
	constructor() {}

	async getAll(): Promise<WeeklyPrizeModel[]> {
		const $ = await fromURL(baseUrl + '/lottery')
		const weeklyPrizesPromise = $('.lot-cy')
			.map((_, ele) => {
				const href = $(ele).children('a')[0].attribs.href
				return this.getYearWeekPath(href)
			})
			.get()

		const allWeeklyPrize = (await Promise.all(weeklyPrizesPromise)).flat()

		const promises: Promise<WeeklyPrizeModel>[] = []
		for (const weeklyPrize of allWeeklyPrize) {
			if (!weeklyPrize.detailUrl) {
				continue
			}
			promises.push(this.weeklyPage(weeklyPrize))
		}

		await Promise.all(promises)

		return allWeeklyPrize
	}

	async getAllWithPagination(page: number = 1): Promise<{
		data: WeeklyPrizeModel[]
		count: number
		pages: number
		prev: number | undefined
		next: number | undefined
	}> {
		const $ = await fromURL(baseUrl + '/lottery')
		const hrefs = $('.lot-cy')
			.map((_, ele) => {
				return $(ele).children('a')[0].attribs.href
			})
			.get()

		const weeklyPrizes = await this.getYearWeekPath(hrefs[page - 1])
		const promises: Promise<WeeklyPrizeModel>[] = []

		for (const weeklyPrize of weeklyPrizes) {
			if (!weeklyPrize.detailUrl) {
				continue
			}
			promises.push(this.weeklyPage(weeklyPrize))
		}

		await Promise.all(promises)

		return {
			data: weeklyPrizes,
			count: weeklyPrizes.length,
			pages: hrefs.length,
			prev: page < 2 || page >= hrefs.length ? undefined : page - 1,
			next: page >= hrefs.length ? undefined : page + 1,
		}
	}

	async *generatorPage(page = 1): AsyncGenerator<WeeklyPrizeModel[], void, unknown> {
		let next: number | undefined = page
		while (next) {
			const response = await this.getAllWithPagination(next)
			yield response.data
			next = response.next
		}
	}

	async getCurrent(): Promise<WeeklyPrizeModel> {
		const weeklyInfo: WeeklyPrizeModel = {
			prizeList: {
				prize1: '',
				last2Digit: '',
				last3Digit: [],
				prize2: [],
				prize3: [],
				prize4: [],
				prize5: [],
			},
			weekly: '',
			year: 0,
			month: 0,
			date: 0,
			detailUrl: '/lottery',
		}
		await this.weeklyPage(weeklyInfo)

		return weeklyInfo
	}

	private extractDate<T extends keyof typeof monthMap>([dayRaw, monthTh, yearTh]: [
		string,
		T,
		string,
	]): DateExtraction {
		const date = Number(dayRaw)
		const month = Number(monthMap[monthTh])
		const year = Number(yearTh) - 543
		return {
			date,
			month,
			year,
			weekly: `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`,
		}
	}

	private async getYearWeekPath(urlPath: string): Promise<WeeklyPrizeModel[]> {
		const $ = await fromURL(baseUrl + urlPath)

		const titleATag = $('.content-main-fullwidth')
			.find('a')
			.filter(
				(_, ele) =>
					ele.name == 'a' &&
					$(ele).text().length > 20 &&
					!!ele.attributes.find((att) => att.name == 'href' && att.value.length == 31),
			)
			.get()

		const info: WeeklyPrizeModel[] = []
		for (const ele of titleATag) {
			const res: WeeklyPrizeModel = {
				prizeList: {
					prize1: '',
					last2Digit: '',
					last3Digit: [],
					prize2: [],
					prize3: [],
					prize4: [],
					prize5: [],
				},
				weekly: '',
				year: 0,
				month: 0,
				date: 0,
				detailUrl: '',
			}
			const dateExtracted = this.extractDate(
				$(ele).text().replace('ตรวจสลากกินแบ่งรัฐบาล งวด ', '').split(/\s+/) as [
					string,
					keyof typeof monthMap,
					string,
				],
			)
			res.date = dateExtracted.date
			res.month = dateExtracted.month
			res.year = dateExtracted.year
			res.weekly = dateExtracted.weekly
			if (res.year > 2000 || new Date(res.weekly).getTime() > dateAfterChangeFormat) {
				res.detailUrl = isTag(ele) ? ele.attribs.href : ''
			}

			const tablePrize = ele.next
			if (!tablePrize) {
				continue
			}
			const list = Object.values($(tablePrize).find('div.lot-dc.lotto-fxl'))

			const prizeList = res.prizeList

			if (isText(list[0].children[0])) {
				prizeList.prize1 = list[0].children[0].data
			}

			if (
				(res.year > 2015 || (res.year === 2015 && res.month > 8)) &&
				list[1]?.children[0]?.type &&
				isText(list[1].children[0]) &&
				isText(list[2].children[0])
			) {
				prizeList.first3Digit = list[1].children[0]?.data.split(/\s+/)
				prizeList.last3Digit = list[2].children[0]?.data.split(/\s+/)
			} else {
				if (isText(list[2].children[0])) {
					prizeList.last3Digit = list[2].children[0]?.data.split(/\s+/)
				}
			}
			if (isText(list[3].children[0])) {
				prizeList.last2Digit = list[3].children[0].data
			}
			info.push(res)
		}

		return info
	}

	private async weeklyPage(model: WeeklyPrizeModel): Promise<WeeklyPrizeModel> {
		const $ = await fromURL(baseUrl + model.detailUrl)
		const prizeList = model.prizeList
		if (!prizeList.prize1) {
			const dateExtracted = this.extractDate(
				$('div.lotto-left > h2').text().replace('ตรวจสลากฯ ตรวจหวย ', '').split(/\s+/) as [
					string,
					keyof typeof monthMap,
					string,
				],
			)
			model.detailUrl = $('#dd_lottery_list > option:nth-child(1)')[0].attribs.value
			const list = Object.values($('div.lot-dc.lotto-fxl'))
			model.date = dateExtracted.date
			model.month = dateExtracted.month
			model.year = dateExtracted.year
			model.weekly = dateExtracted.weekly
			if (isText(list[0].children[0])) {
				prizeList.prize1 = list[0].children[0].data
			}
			if (isText(list[1].children[0])) {
				prizeList.first3Digit = list[1].children[0].data.split(/\s+/)
			}
			if (isText(list[2].children[0])) {
				prizeList.last3Digit = list[2].children[0].data.split(/\s+/)
			}
			if (isText(list[3].children[0])) {
				prizeList.last2Digit = list[3].children[0].data
			}
		}

		$('div.lot-dc.lotto-fx.lot-c30').each((i, ele) => {
			if (i < 5) {
				prizeList.prize2.push($(ele).text())
			} else if (i < 15) {
				prizeList.prize3.push($(ele).text())
			} else if (i < 65) {
				prizeList.prize4.push($(ele).text())
			} else {
				prizeList.prize5.push($(ele).text())
			}
		})

		return model
	}
}
