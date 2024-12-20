// import { Controller, Get, Inject, Req } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from '@anatine/zod-nestjs'
import { LottoClientService } from '@app/@libs-lotto-client/lotto-client.service'
import { Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'
import { CreateLotto } from '../dto/create-lotto.dto'
import { LottoService } from '../service/lotto.service'
@Controller('lotto')
export class LottoController {
	constructor(
		private readonly lottoClientService: LottoClientService,
		private readonly lottaService: LottoService,
		// @InjectRepository(LottoEntity) private readonly lottoRepo: BaseFirestoreRepository<LottoEntity>,
	) {}

	@Get('/pages')
	@ApiCreatedResponse({
		type: createZodDto(CreateLotto),
	})
	async getAll(@Query('page', new ZodValidationPipe({})) page: number) {
		return await this.lottoClientService.getAllWithPagination(Number(page ?? 1))
	}

	@Get('/current')
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
			last2Digi: prizeList.last2Digi,
			last3Digi: prizeList.last3Digi,
			first3Digi: prizeList.first3Digi,
		})
	}

	@Get('/current-check')
	async getCurrentCheck() {
		return await this.lottaService.prizeCheck('2024-06-16', ['016777', '606426', '123431'])
	}
	// @Get('/tranfer')
	// async getTranfer() {
	// 	const res = await this.lottoClientService.getCurrent()
	// 	return await this.lottaService.create(res)
	// }

	// @Post('/migrate')
	// async createMigrate() {
	// 	const res = await this.lottoClientService.getCurrent()
	// 	return await this.lottaService.create(res)
	// }
	@Post('/a/:page')
	async a(@Param('page') page: number) {
		const a = await this.lottoClientService.getAllWithPagination(page)
		// await this.lottaService.batchCreate(
		// 	a.data.map(({ prizeList, ...lotto }) => ({
		// 		date: lotto.date,
		// 		id: lotto.weekly,
		// 		year: lotto.year,
		// 		month: lotto.month,
		// 		prize1: prizeList.prize1,
		// 		prize2: prizeList.prize2,
		// 		prize3: prizeList.prize3,
		// 		prize4: prizeList.prize4,
		// 		prize5: prizeList.prize5,
		// 		last2Digi: prizeList.last2Digi,
		// 		last3Digi: prizeList.last3Digi,
		// 		first3Digi: prizeList.first3Digi,
		// 	})),
		// )
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
						last2Digi: prizeList.last2Digi,
						last3Digi: prizeList.last3Digi,
						first3Digi: prizeList.first3Digi,
					})),
				),
			)
		}

		const res = await Promise.all(createdLotto)

		return { created: res.reduce((acc, curr) => acc + curr.length, 0) }
	}

	// @Get('/aaa')
	// async getA(@Query('page', new ParseIntPipe({ optional: true })) page: number) {
	// 	// const res = await this.lottoRepo.findById('2023-10-01')
	// 	// console.log(res.scanPrize('02'))

	// 	return {}
	// }
}
