import { LottoClientService } from '@app/lotto-client'
// import { Controller, Get, Inject, Req } from '@nestjs/common'
import { TimeService } from '@app/time'
import { Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common'
import { LottoEntity } from './lotto.entity'
import { LottoService } from './lotto.service'

@Controller('lotto')
export class LottoController {
	constructor(
		private readonly lottoClientService: LottoClientService,
		private readonly timeService: TimeService,
		private readonly lottaService: LottoService,
		// @InjectRepository(LottoEntity) private readonly lottoRepo: BaseFirestoreRepository<LottoEntity>,
	) {}

	@Get('/pages')
	async getAll(@Query('page', new ParseIntPipe({ optional: true })) page: number) {
		return await this.lottoClientService.getAllWithPagination(Number(page ?? 1))
	}

	@Get('/current')
	async getCurrent() {
		console.log(process.env)
		return await this.lottoClientService.getCurrent()
	}

	@Get('/tranfer')
	async getTranfer() {
		const res = await this.lottoClientService.getCurrent()
		return await this.lottaService.create(res)
	}

	@Post('/migrate')
	async createMigrate() {
		const res = await this.lottoClientService.getCurrent()
		return await this.lottaService.create(res)
	}

	@Post('/migrates')
	async createInitialize() {
		const generator = this.lottoClientService.generatorPage()
		const createdLotto: Promise<LottoEntity[]>[] = []

		for await (const pages of generator) {
			createdLotto.push(this.lottaService.batchCreate(pages))
		}

		const res = await Promise.all(createdLotto)

		return { created: res.reduce((acc, curr) => acc + curr.length, 0) }
	}

	@Get('/aaa')
	async getA(@Query('page', new ParseIntPipe({ optional: true })) page: number) {
		console.log(this.timeService.parse('2023-10-16'))
		// const res = await this.lottoRepo.findById('2023-10-01')
		// console.log(res.scanPrize('02'))

		return {}
	}
}
