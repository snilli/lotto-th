import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { load } from 'cheerio'
import { isTag, isText } from 'domhandler'
import { firstValueFrom } from 'rxjs'
import { DateExtraction, WeeklyPrizeModel } from './interfaces.js'

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

@Injectable()
export class LottoClientService {
	constructor(private readonly httpService: HttpService) {}

	async getAll() {
		const { data: html } = await firstValueFrom(this.httpService.get<string>('/lottery'))
		const $ = load(html)
		const yearPages: Promise<string>[] = []

		$('.lot-cy').each((_, ele) => {
			const href = $(ele).children('a')[0].attribs.href
			yearPages.push(this.getHtml(href))
		})

		const allWeeklyPrize: WeeklyPrizeModel[] = []
		const weeklyPagesPromises: (Promise<string> | undefined)[] = []

		for (const yearPage of await Promise.all(yearPages)) {
			for (const weeklyPrize of this.getYearWeekPath(yearPage)) {
				allWeeklyPrize.push(weeklyPrize)
				weeklyPagesPromises.push(weeklyPrize.detailUrl ? this.getHtml(weeklyPrize.detailUrl) : undefined)
			}
		}

		const weeklyPages = await Promise.all(weeklyPagesPromises)
		for (const [idx, info] of allWeeklyPrize.entries()) {
			if (!info.detailUrl) {
				console.log(1)
				continue
			}
			this.weeklyPage(info, weeklyPages[idx])
		}

		return allWeeklyPrize
	}

	async getAllWithPagination(page: number = 1) {
		const { data: html } = await firstValueFrom(this.httpService.get<string>(''))
		const $ = load(html)
		const pages: string[] = []
		$('.lot-cy').each((_, ele) => {
			pages.push($(ele).children('a')[0].attribs.href)
		})

		const yearPage = await this.getHtml(pages[page - 1])
		const weeklyInfo = this.getYearWeekPath(yearPage)
		const weeklyPages = await Promise.all(
			weeklyInfo.map((info) => (info.detailUrl ? this.getHtml(info.detailUrl) : undefined)),
		)

		for (const [idx, info] of weeklyInfo.entries()) {
			if (!info.detailUrl) {
				continue
			}
			this.weeklyPage(info, weeklyPages[idx])
		}

		return {
			data: weeklyInfo,
			count: weeklyInfo.length,
			pages: pages.length,
			prev: page < 2 || page >= pages.length ? undefined : page - 1,
			next: page >= pages.length ? undefined : page + 1,
		}
	}

	async *generatorPage(page = 1) {
		let next: number | undefined = page
		while (next) {
			const response = await this.getAllWithPagination(next)
			yield response.data
			next = response.next
		}
	}

	async getCurrent() {
		const page = await this.getHtml('')
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
			detailUrl: '',
		}
		this.weeklyPage(weeklyInfo, page)

		return weeklyInfo
	}

	private async getHtml(url: string) {
		const { data: html } = await firstValueFrom(this.httpService.get<string>(url))
		return html
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

	private getYearWeekPath(html: string): WeeklyPrizeModel[] {
		const $ = load(html)
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

	private weeklyPage(model: WeeklyPrizeModel, html?: string) {
		if (!html) {
			return
		}

		const $ = load(html)
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
