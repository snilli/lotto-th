import { InjectServiceTag } from '@app/@libs-drizzle/drizzle.decorator'
import { DrizzleMainRepo } from '@app/@libs-drizzle/drizzle.repo'
import { LottoAggregate } from '@app/internal/lotto/domain/entity/lotto.aggregate'
import {
	CheckGlobalPrizeResponse,
	CheckLocalPrizeInput,
	CheckLocalPrizeKind,
	CheckLocalPrizeResponse,
	CheckLocalPrizeType,
	GlobalLottoPrizeList,
} from '@app/internal/lotto/domain/repository/interface/lotto.repository'
import { LottoRepository } from '@app/internal/lotto/domain/repository/lotto.repository'
import { BaseRepository } from '@app/internal/share/infrastructure/postgres/repository/base.repository'
import { schemaType } from '@app/internal/share/infrastructure/postgres/schema/index'
import { Injectable } from '@nestjs/common'
import { sql } from 'drizzle-orm'
import { VercelPgDatabase } from 'drizzle-orm/vercel-postgres'
import { lotto } from '../schema/index'
import { LottoModel } from '../schema/lotto.interface'

@Injectable()
export class DrizzleLottoRepository
	extends DrizzleMainRepo<schemaType>
	implements LottoRepository, BaseRepository<LottoAggregate, LottoModel>
{
	constructor(@InjectServiceTag('vercel') protected readonly db: VercelPgDatabase<schemaType>) {
		super()
	}

	async getById(id: string) {
		const model = await this.db.query.lotto
			.findFirst({
				where: (fields, operators) => operators.eq(fields.id, id),
			})
			.execute()

		if (!model) {
			return
		}

		return this.mapModelToAggregate(model)
	}

	async getAllById(ids: string[]) {
		const models = await this.db.query.lotto
			.findMany({
				where: (fields, operators) => operators.inArray(fields.id, ids),
			})
			.execute()

		return models.map((model) => this.mapModelToAggregate(model))
	}

	async checkLocalPrize(date: string, inputs: CheckLocalPrizeInput[]): Promise<CheckLocalPrizeResponse[]> {
		return await this.db
			.select({
				number: sql<string>`t.number`.as('lotto'),
				isWin: sql<boolean>`CASE
					WHEN right(${lotto.prize1}, 2) = right(t.number, 2) AND t.kind = '2digit-global' AND t.type = 'exactly' THEN true
				 	WHEN sort_string(right(${lotto.prize1}, 2)) = right(sort_string(t.number), 2) AND t.kind = '2digit-global' AND t.type = 'ordering' THEN true
				 	WHEN ${lotto.last2Digit} = right(t.number, 2) AND t.kind = '2digit-local' AND t.type = 'exactly' THEN true
				 	WHEN sort_string(${lotto.last2Digit}) = right(sort_string(t.number), 2) AND t.kind = '2digit-local' AND t.type = 'ordering' THEN true
				 	WHEN right(${lotto.prize1}, 3) = right(t.number, 3) AND t.kind = '3digit-global' AND t.type = 'exactly' THEN true
				 	WHEN sort_string(right(${lotto.prize1}, 3)) = right(sort_string(t.number), 3) AND t.kind = '3digit-global' AND t.type = 'ordering' THEN true
				 	WHEN ${lotto.first3Digit} || ${lotto.last3Digit} @> jsonb_build_array(right(t.number, 3)) AND t.kind = '3digit-local' AND t.type = 'exactly' THEN true
				 	WHEN sort_jsonb(${lotto.first3Digit} || ${lotto.last3Digit}) @> jsonb_build_array(right(sort_string(t.number), 3)) AND t.kind = '3digit-local' AND t.type = 'ordering' THEN true
					ELSE false
				END`.as('result'),
				kind: sql<CheckLocalPrizeKind>`t.kind`.as('kind'),
				type: sql<CheckLocalPrizeType>`t.type`.as('type'),
			})
			.from(lotto)
			.innerJoin(
				sql`jsonb_to_recordset(${`${JSON.stringify(inputs)}`}) as t(kind text, type text, number text)`,
				sql`${lotto.id} = ${date}`,
			)
			.execute()
	}

	async checkGlobalPrize(date: string, lottos: string[]): Promise<CheckGlobalPrizeResponse[]> {
		return await this.db
			.select({
				number: sql<string>`t.number`.as('number'),
				result: sql<GlobalLottoPrizeList>`CASE
					WHEN ${lotto.prize1} = t.number THEN 'prize1'
					WHEN ${lotto.prize2} @> jsonb_build_array(t.number) THEN 'prize2'
					WHEN ${lotto.prize3} @> jsonb_build_array(t.number) THEN 'prize3'
					WHEN ${lotto.prize4} @> jsonb_build_array(t.number) THEN 'prize4'
					WHEN ${lotto.prize5} @> jsonb_build_array(t.number) THEN 'prize5'
					WHEN ${lotto.last2Digit} = right(t.number, 2) THEN 'last-2digit'
					WHEN ${lotto.first3Digit} @> jsonb_build_array(left(t.number, 3)) THEN 'first-3digit'
					WHEN ${lotto.last3Digit} @> jsonb_build_array(right(t.number, 3)) THEN 'last-3Digit'
					ELSE 'not-match'
				END
				`.as('result'),
			})
			.from(lotto)
			.innerJoin(
				sql`unnest(ARRAY[${sql.raw(lottos.map((l) => `'${l}'`).join(','))}]::text[]) as t(number)`,
				sql`${lotto.id} = ${date}`,
			)
			.execute()
	}

	async create(agg: LottoAggregate) {
		const model = this.mapAggregateToModel(agg)

		const [res] = await this.db
			.insert(lotto)
			.values(model)
			.onConflictDoUpdate({ target: lotto.id, set: model })
			.returning()
			.execute()

		return this.mapModelToAggregate(res)
	}

	async batchCreate(aggs: LottoAggregate[]) {
		const models = await this.db
			.insert(lotto)
			.values(aggs.map((agg) => this.mapAggregateToModel(agg)))
			.onConflictDoNothing()
			.returning()
			.execute()

		return models.map((model) => this.mapModelToAggregate(model))
	}

	mapAggregateToModel(agg: LottoAggregate): LottoModel {
		const state = agg.toJson()
		return {
			id: state.id,
			date: state.date,
			year: state.year,
			month: state.month,
			prize1: state.prize1,
			prize2: state.prize2,
			prize3: state.prize3,
			prize4: state.prize4,
			prize5: state.prize5,
			last2Digit: state.last2Digit,
			first3Digit: state.first3Digit ?? null,
			last3Digit: state.last3Digit,
			createdAt: state.createdAt,
			updatedAt: state.updatedAt,
		}
	}

	mapModelToAggregate(model: LottoModel): LottoAggregate {
		return new LottoAggregate({
			id: model.id,
			date: model.date,
			year: model.year,
			month: model.month,
			prize1: model.prize1,
			prize2: model.prize2,
			prize3: model.prize3,
			prize4: model.prize4,
			prize5: model.prize5,
			last2Digit: model.last2Digit,
			first3Digit: model.first3Digit ?? undefined,
			last3Digit: model.last3Digit,
			createdAt: model.createdAt,
			updatedAt: model.updatedAt,
		})
	}
}
