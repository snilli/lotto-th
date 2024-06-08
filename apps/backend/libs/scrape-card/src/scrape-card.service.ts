import { FsService } from '@lib/fs'
import { InjectFs } from '@lib/fs/utils/fs-token'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import * as cheerio from 'cheerio'
import { firstValueFrom } from 'rxjs'
import {
	Card,
	DigimonCard,
	DigimonLevel,
	DigimonType,
	OptionCard,
	OptionType,
	Synthesis,
} from './scrape-card.interface'

const regex = /[<|>]= /i
@Injectable()
export class ScrapeCardService {
	private $!: cheerio.Root
	constructor(
		private readonly httpService: HttpService,
		@InjectFs('image') private readonly imageFsService: FsService,
		@InjectFs('json') private readonly jsonFsService: FsService,
	) {}
	set$(html: string) {
		this.$ = cheerio.load(html)
	}

	getCards(): Card[] {
		if (!this.jsonFsService.existFile('card.json')) {
			return []
		}

		return JSON.parse(this.jsonFsService.readFile('card.json')) as Card[]
	}
	async getImages() {
		const cards = this.getCards()
		for (const card of cards) {
			const { data: image } = await firstValueFrom(
				this.httpService.get(card.img, {
					responseType: 'arraybuffer',
				}),
			)

			this.imageFsService.writeFile(`${card.no}.png`, image)
		}
	}

	async updateDigimonMaterial() {
		const { data: html } = await firstValueFrom(
			this.httpService.get<string>('/ps/526754-digimon-digital-card-battle/faqs/78563/misc-info'),
		)
		this.set$(html)
		const synthesises = this.getSynthesises(this.$('table').eq(2).children().children().slice(1))

		const cards = this.getCards()
		for (const synthesis of synthesises) {
			const card = cards.find((card) => card.name === synthesis.name && card.type === synthesis.type)
			if (!card) {
				continue
			}

			card.synthesis_point = synthesis.synthesis_point
			card.synthesis_require = synthesis.synthesis_require
		}

		this.jsonFsService.writeFile('card.json', cards)
	}

	async a() {
		const { data: html } = await firstValueFrom(
			this.httpService.get<string>(
				'/ps/526754-digimon-digital-card-battle/faqs/78563/100-card-collection-extra-notes',
			),
		)
		this.set$(html)
		const a = this.$('table').eq(1).children().eq(0).children()
		const header = a
			.eq(0)
			.children()
			.slice(1)
			.map((i, ele) => this.$(ele).text())
			.toArray() as unknown as string[]
		const res: Record<string, string> = {}
		this.b(a.eq(1).children(), header, res)
		this.b(a.eq(2).children(), header, res)
		this.b(a.eq(3).children(), header, res)
		this.b(a.eq(4).children(), header, res)
		this.b(a.eq(5).children(), header, res)
		this.b(a.eq(6).children(), header, res)

		this.$('table')
			.eq(3)
			.children()
			.eq(0)
			.children()
			.slice(1)
			.each((i, ele) => {
				const [target, d1, d2] = this.$(ele)
					.children()
					.map((ii, eee) => this.$(eee).text().split(' ')[0])
					.toArray() as unknown as string[]
				res[`${d1}${d2}`] = target
				res[`${d2}${d1}`] = target
			})
		console.log(res)
	}

	b(elements: cheerio.Cheerio, header: string[], res: Record<string, string>) {
		const row = this.$(elements).slice(0, 1).text()
		return this.$(elements)
			.slice(1)
			.each((i, ele) => {
				res[`${row}${header[i]}`] = this.$(ele).text()
			})
	}

	async getAll() {
		const { data: html } = await firstValueFrom(
			this.httpService.get<string>(
				'/ps/526754-digimon-digital-card-battle/faqs/78563/100-card-collection-extra-notes',
			),
		)
		this.set$(html)

		let cards: Card[] = []
		cards = cards.concat(this.getDigimons(this.$('table').slice(5, 196)))
		cards = cards.concat(this.getOptions(this.$('table').slice(196, 277), 'normal'))
		cards = cards.concat(this.getOptions(this.$('table').slice(277, 297), 'gem'))
		cards = cards.concat(this.getOptions(this.$('table').slice(297), 'evolution'))
		this.jsonFsService.writeFile('card.json', cards)
		return cards
	}

	private getSynthesises(elements: cheerio.Cheerio): Synthesis[] {
		return elements.map((i, ele) => this.getSynthesis(ele)).toArray() as unknown as Synthesis[]
	}

	private getSynthesis(element: cheerio.Element): Synthesis {
		const tr = this.$(element).children()
		return {
			type: tr.eq(0).text() as DigimonType,
			name: tr.eq(1).text(),
			synthesis_point: parseInt(tr.eq(2).text()),
			synthesis_require: parseInt(tr.eq(3).text().replace(regex, '').replace('-', '0')),
		}
	}

	private getOptions(elements: cheerio.Cheerio, type: OptionType): OptionCard[] {
		return elements.map((i, ele) => this.getOption(ele, type)).toArray() as unknown as OptionCard[]
	}

	private getDigimons(elements: cheerio.Cheerio): DigimonCard[] {
		return elements.map((i, ele) => this.getDigimon(ele)).toArray() as unknown as DigimonCard[]
	}

	private getDigimon(element: cheerio.Element): DigimonCard {
		const rows = this.$(element).find('tr')
		const r1 = rows.eq(0).children()
		const r2 = rows.eq(1).children()
		const r3 = rows.eq(2).children()
		const r4 = rows.eq(3).children()
		const r5 = rows.eq(4).children()
		const r6 = rows.eq(5).children()
		const r7 = rows.eq(6).children()

		return {
			name: r1.eq(0).text(),
			img: r1.eq(0).find('img').prop('src'),
			no: r1.eq(2).text(),
			level: r1.eq(4).text() as DigimonLevel,
			hp: parseInt(r2.eq(1).text()),
			support_effect: r2.eq(4).text(),
			dp_require: parseInt(r3.eq(1).text()),
			dp: parseInt(r3.eq(3).text()),
			circle: parseInt(r4.eq(1).text()),
			triangle: parseInt(r5.eq(1).text()),
			cross: parseInt(r6.eq(1).text()),
			active_effect: r7.eq(1).text(),
			type: r2.eq(3).text() as DigimonType,
			synthesis_point: 0,
			synthesis_require: 0,
			// O:
			// △:
			// X:
		}
	}

	private getOption(element: cheerio.Element, type: OptionType): OptionCard {
		const rows = this.$(element).find('tr')
		const r1 = rows.eq(0).children()
		const r3 = rows.eq(2).children()

		return {
			name: r1.eq(0).text(),
			img: r1.eq(0).find('img').prop('src'),
			no: r1.eq(2).text(),
			support_effect: r3.text(),
			type: 'Option',
			level: 'O',
			option_type: type,
			synthesis_point: 0,
			synthesis_require: 0,
		}
	}
}
