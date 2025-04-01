import { LottoClientService } from '@app/@libs-lotto-client/lotto-client.service.js'
import { Controller, Get, Post } from '@nestjs/common'
import { Type } from '@sinclair/typebox'
import { Validate } from 'nestjs-custom-typebox'
import { CreateLotto } from '../dto/create-lotto.dto.js'
import { PrizeCheck } from '../dto/prize-check.dto.js'
import { LottoService } from '../service/lotto.service.js'

@Controller('lotto')
export class LottoController {
	constructor(
		private readonly lottoClientService: LottoClientService,
		private readonly lottaService: LottoService,
	) {}

	@Get('/pages')
	async getAll() {
		return await this.lottoClientService.getAll()
	}

	@Get('/current')
	@Validate({
		default: {
			schema: Type.Array(CreateLotto),
			name: '1232',
		},
		responses: [
			{
				httpMessage: 'NOT_FOUND',
				name: 'NOT_FOUND',
			},
			{
				httpMessage: 'SERVICE_UNAVAILABLE',
				name: 'SERVICE_UNAVAILABLE',
			},
		],
	})
	async getCurrent() {
		const { prizeList, ...lotto } = await this.lottoClientService.getCurrent()
		return await this.lottaService.create({
			date: lotto.date,
			id: lotto.weekly,
			year: lotto.year,
			month: lotto.month,
			prize1: prizeList.prize1,
			prize2: prizeList.prize2,
			prize3: prizeList.prize3,
			prize4: prizeList.prize4,
			prize5: prizeList.prize5,
			last2Digit: prizeList.last2Digit,
			last3Digit: prizeList.last3Digit,
			first3Digit: prizeList.first3Digit,
		})
	}

	@Post('/check/:date')
	@Validate({
		request: [
			{
				type: 'param',
				schema: Type.String(),
				name: 'date',
				required: true,
			},
			{
				type: 'body',
				schema: PrizeCheck,
				required: true,
			},
		],
	})
	async prizeCheck(date: string, payload: PrizeCheck) {
		return await this.lottaService.prizeCheck(date, payload)
	}

	@Post('/a/:page')
	@Validate({
		request: [
			{
				type: 'param',
				schema: Type.Number(),
				required: true,
				name: 'page',
			},
		],
	})
	async a(page: number) {
		const a = await this.lottoClientService.getAllWithPagination(page)
		await this.lottaService.batchCreate(
			a.data.map(({ prizeList, ...lotto }) => ({
				date: lotto.date,
				id: lotto.weekly,
				year: lotto.year,
				month: lotto.month,
				prize1: prizeList.prize1,
				prize2: prizeList.prize2,
				prize3: prizeList.prize3,
				prize4: prizeList.prize4,
				prize5: prizeList.prize5,
				last2Digit: prizeList.last2Digit,
				last3Digit: prizeList.last3Digit,
				first3Digit: prizeList.first3Digit,
			})),
		)
		return {
			...a,
			count: a.data.length,
		}
	}

	@Post('/migrates')
	async createInitialize() {
		const generator = this.lottoClientService.generatorPage()
		const createdLotto: Promise<any[]>[] = []

		for await (const pages of generator) {
			createdLotto.push(
				this.lottaService.batchCreate(
					pages.map(({ prizeList, ...lotto }) => ({
						date: lotto.date,
						id: lotto.weekly,
						year: lotto.year,
						month: lotto.month,
						prize1: prizeList.prize1,
						prize2: prizeList.prize2,
						prize3: prizeList.prize3,
						prize4: prizeList.prize4,
						prize5: prizeList.prize5,
						last2Digit: prizeList.last2Digit,
						last3Digit: prizeList.last3Digit,
						first3Digit: prizeList.first3Digit,
					})),
				),
			)
		}

		const res = await Promise.all(createdLotto)

		return { created: res.reduce((acc, curr) => acc + curr.length, 0) }
	}
}
