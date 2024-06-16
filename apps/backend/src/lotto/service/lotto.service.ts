import { Injectable } from '@nestjs/common'
import { CreateLottoOption } from '../dto/create-lotto.dto'
import { LottoRepo } from '../repo/lotto.repo'

@Injectable()
export class LottoService {
	constructor(private readonly lottoRepo: LottoRepo) {}

	async getById(id: string) {
		return await this.lottoRepo.getById(id)
	}

	create(data: CreateLottoOption) {
		return this.lottoRepo.create(data)
	}

	// private dtoToEntity(input: any) {
	// 	const a = this.db.insert(this.drizzleSchemaService.getSchme('lottoTable')).values().returning()
	// 	const lotto = new LottoEntity()
	// 	lotto.id = input.weekly
	// 	lotto.prizeList = input.prizeList
	// 	lotto.year = input.year
	// 	lotto.month = input.month
	// 	lotto.date = input.date
	// 	lotto.timestamp = this.timeService.parse(input.weekly)
	// 	return lotto
	// }
	// async create(input: CreateLottoInput) {
	// 	const lotto = this.dtoToEntity(input)
	// 	await this.lottoRepo.create(lotto)

	// 	return lotto
	// }

	async batchCreate(input: CreateLottoOption[]) {
		return this.lottoRepo.batchCreate(input)
	}

	async prizeCheck(date: string, lottos: string[]) {
		return this.lottoRepo.prizeCheck(date, lottos)
	}
}
