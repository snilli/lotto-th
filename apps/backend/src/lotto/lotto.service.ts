import { DrizzleSchemaService, schemaType } from '@lib/drizzle-schema'
import { InjectDbTag } from '@lib/drizzle-wrapper/drizzle-wrapper.decorator'
import { TimeService } from '@lib/time'
import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

@Injectable()
export class LottoService {
	constructor(
		private readonly timeService: TimeService,
		@InjectDbTag('vercel') private readonly db: NodePgDatabase<schemaType>,
		@Inject(DrizzleSchemaService) private readonly drizzleSchemaService: DrizzleSchemaService,
	) {}

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

	// async getAllId(ids: string[]) {
	// 	return await ids
	// 		.reduce((acc, curr) => {
	// 			acc.whereEqualTo('id', curr)
	// 			return acc
	// 		}, this.lottoRepo)
	// 		.find()
	// }

	// async batchCreate(input: CreateLottoInput[]) {
	// 	const getAllLotto = await this.getAllId(input.map((item) => item.weekly))
	// 	const foundLottoMap = new Map(getAllLotto.map((lotto) => [lotto.id, lotto]))

	// 	const batch = this.lottoRepo.createBatch()
	// 	const lottoList: LottoEntity[] = []
	// 	for (const item of input) {
	// 		if (foundLottoMap.get(item.weekly)) {
	// 			continue
	// 		}

	// 		const lotto = this.dtoToEntity(item)
	// 		batch.create(lotto)
	// 		lottoList.push(lotto)
	// 	}

	// 	await batch.commit()

	// 	return lottoList
	// }
}
