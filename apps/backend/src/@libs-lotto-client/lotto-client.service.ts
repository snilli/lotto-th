import { Injectable } from '@nestjs/common'

import { HttpService } from '@nestjs/axios'
import { load } from 'cheerio'
import { firstValueFrom } from 'rxjs'

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
export interface WeeklyPrizeModel {
	year: number
	month: number
	date: number
	weekly: string
	detailUrl: string
	prizeList: {
		prize1: string
		prize2: string[]
		prize3: string[]
		prize4: string[]
		prize5: string[]
		last2Digi: string
		first3Digi?: string[]
		last3Digi: string[]
	}
}

interface DateExtraction {
	year: number
	month: number
	date: number
	weekly: string
}
@Injectable()
export class LottoClientService {
	constructor(private readonly httpService: HttpService) {}

	async getAll() {
		const { data: html } = await firstValueFrom(this.httpService.get<string>(''))
		const $ = load(html)
		const allPage: string[] = []
		$('.lot-c1x').each((_, ele) => {
			const href = $(ele).children('a')[0]['attribs']['href'] as string
			allPage.push(href)
		})

		const yearPages = await Promise.all(allPage.map((path) => this.getHtml(path)))
		const weeklyInfo = yearPages
			.map((yearPage) => {
				return this.getYearWeekPath(yearPage)
			})
			.reduce((acc, cur) => {
				acc.push(...cur)
				return acc
			}, [])
		const weeklyPages = await Promise.all(
			weeklyInfo.map((info) => (info.detailUrl ? this.getHtml(info.detailUrl) : undefined)),
		)
		for (const [idx, info] of weeklyInfo.entries()) {
			if (!info.detailUrl) {
				continue
			}
			this.weeklyPage(info, weeklyPages[idx])
		}
		return weeklyInfo
	}

	async getAllWithPagination(page?: number) {
		if (!page) {
			page = 1
		}

		const { data: html } = await firstValueFrom(this.httpService.get<string>(''))
		const $ = load(html)
		const pages: string[] = []

		$('.lot-c1x').each((_, ele) => {
			const href = $(ele).children('a')[0]['attribs']['href'] as string
			pages.push(href)
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

	async *generatorPage(page?: number) {
		let next: number | undefined = page ?? 1
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
				last2Digi: '',
				last3Digi: [],
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

	private getYearWeekPath(html: string) {
		const $ = load(html)
		const info: WeeklyPrizeModel[] = []
		$('table#dl_lottery_stats_list')
			.find('td')
			.each((_, ele) => {
				const res: WeeklyPrizeModel = {
					prizeList: {
						prize1: '',
						last2Digi: '',
						last3Digi: [],
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
				const [, tagA, , tagDiv] = ele['children']
				const dateExtracted = this.extractDate(
					$(tagA).text().replace('ตรวจสลากกินแบ่งรัฐบาล งวด ', '').split(/\s+/) as [
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
					res.detailUrl = tagA.type === 'tag' ? tagA['attribs']['href'] : ''
				}

				const list = Object.values($(tagDiv).find('div.lot-dc.lotto-fxl'))
				const prizeList = res.prizeList
				if (list[0]['children'][0]['type'] === 'text') {
					prizeList.prize1 = list[0]['children'][0].data
				}

				if (
					(res.year > 2015 || (res.year === 2015 && res.month > 8)) &&
					list[1]['children'][0]['type'] === 'text' &&
					list[2]['children'][0]['type'] === 'text'
				) {
					prizeList.first3Digi = list[1]['children'][0]?.data.split(/\s+/)
					prizeList.last3Digi = list[2]['children'][0]?.data.split(/\s+/)
				} else {
					if (list[2]['children'][0]['type'] === 'text') {
						prizeList.last3Digi = list[2]['children'][0]?.data.split(/\s+/)
					}
				}
				if (list[3]['children'][0]['type'] === 'text') {
					prizeList.last2Digi = list[3]['children'][0].data
				}
				info.push(res)
			})
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
			model.detailUrl = $('#dd_lottery_list > option:nth-child(1)')[0]['attribs']['value']
			const list = Object.values($('div.lot-dc.lotto-fxl'))
			model.date = dateExtracted.date
			model.month = dateExtracted.month
			model.year = dateExtracted.year
			model.weekly = dateExtracted.weekly
			if (list[0]['children'][0]['type'] === 'text') {
				prizeList.prize1 = list[0]['children'][0].data
			}
			if (list[1]['children'][0]['type'] === 'text') {
				prizeList.first3Digi = list[1]['children'][0].data.split(/\s+/)
			}
			if (list[2]['children'][0]['type'] === 'text') {
				prizeList.last3Digi = list[2]['children'][0].data.split(/\s+/)
			}
			if (list[3]['children'][0]['type'] === 'text') {
				prizeList.last2Digi = list[3]['children'][0].data
			}
		}

		if (!model.detailUrl) {
			return
		}

		prizeList.prize2 = []
		prizeList.prize3 = []
		prizeList.prize4 = []
		prizeList.prize5 = []
		$('div.lot-dc.lotto-fx.lot-c20').each((i, ele) => {
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
	}
}
