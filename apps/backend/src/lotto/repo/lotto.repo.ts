import { InjectServiceTag } from '@app/@libs-drizzle/drizzle.decorator.js'
import { DrizzleMainRepo } from '@app/@libs-drizzle/drizzle.repo.js'
import { schemaType } from '@app/schema.js'
import { Injectable } from '@nestjs/common'
import { Array } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import { sql } from 'drizzle-orm'
import { VercelPgDatabase } from 'drizzle-orm/vercel-postgres'
import { LottoSchema } from '../dto/create-lotto.dto.js'
import { Lotto } from '../entities/lotto.entity.js'
import { lotto } from '../schema/index.js'
import { CreateLottoInput, PrizeCheckLocalInput } from './interfaces.js'

@Injectable()
export class LottoRepo extends DrizzleMainRepo<schemaType> {
	constructor(@InjectServiceTag('vercel') protected readonly db: VercelPgDatabase<schemaType>) {
		super()
	}
	getById(id: string) {
		return this.db.query.lotto
			.findFirst({
				where: (fields, operators) => operators.eq(fields.id, id),
			})
			.execute()
	}

	getAllById(ids: string[]) {
		return this.db.query.lotto
			.findMany({
				where: (fields, operators) => operators.inArray(fields.id, ids),
			})
			.execute()
	}

	async prizeCheckLocal(date: string, input: PrizeCheckLocalInput[]) {
		const q = this.db
			.select({
				lotto: sql<string>`t.number`.as('lotto'),
				result: sql<boolean>`CASE
					WHEN right(${lotto.prize1}, 2) = right(t.number, 2) AND t.kind = '2digit-global' AND t.type = 'exactly' THEN true
				 	WHEN sort_string(right(${lotto.prize1}, 2)) = right(sort_string(t.number), 2) AND t.kind = '2digit-global' AND t.type = 'ordering' THEN true
				 	WHEN ${lotto.last2Digit} = right(t.number, 2) AND t.kind = '2digit-local' AND t.type = 'exactly' THEN true
				 	WHEN sort_string(${lotto.last2Digit}) = right(sort_string(t.number), 2) AND t.kind = '2digit-local' AND t.type = 'ordering' THEN true
				 	WHEN right(${lotto.prize1}, 3) = right(t.number, 3) AND t.kind = '3digit-global' AND t.type = 'exactly' THEN true
				 	WHEN sort_string(right(${lotto.prize1}, 3)) = right(sort_string(t.number), 3) AND t.kind = '3digit-global' AND t.type = 'ordering' THEN true
				 	WHEN ${lotto.last3Digit} @> jsonb_build_array(right(t.number, 3)) AND t.kind = '3digit-local' AND t.type = 'exactly' THEN true
				 	WHEN sort_jsonb(${lotto.last3Digit}) @> jsonb_build_array(right(sort_string(t.number), 3)) AND t.kind = '3digit-local' AND t.type = 'ordering' THEN true
					ELSE false
				END`.as('result'),
				kind: sql<string>`t.kind`.as('kind'),
				type: sql<string>`t.type`.as('type'),
			})
			.from(lotto)
			.innerJoin(
				sql`jsonb_to_recordset(${`${JSON.stringify(input)}`}) as t(kind text, type text, number text)`,
				sql`${lotto.id} = ${date}`,
			)
		console.log(q.toSQL())
		return q.execute()
	}

	async prizeCheckGlobal(date: string, lottos: string[]) {
		return await this.db
			.select({
				lotto: sql<string>`t.number`.as('lotto'),
				result: sql<string | null>`CASE
					WHEN ${lotto.prize1} = t.number THEN 'prize1'
					WHEN ${lotto.prize2} @> jsonb_build_array(t.number) THEN 'prize2'
					WHEN ${lotto.prize3} @> jsonb_build_array(t.number) THEN 'prize3'
					WHEN ${lotto.prize4} @> jsonb_build_array(t.number) THEN 'prize4'
					WHEN ${lotto.prize5} @> jsonb_build_array(t.number) THEN 'prize5'
					WHEN ${lotto.last2Digit} = right(t.number, 2) THEN 'last-2digit'
					WHEN ${lotto.first3Digit} @> jsonb_build_array(left(t.number, 3)) THEN 'first-3digit'
					WHEN ${lotto.last3Digit} @> jsonb_build_array(right(t.number, 3)) THEN 'last-3Digit'
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

	async create(input: CreateLottoInput): Promise<Lotto[]> {
		const data = Value.Parse(LottoSchema, input)
		return (await this.db
			.insert(lotto)
			.values(data)
			.onConflictDoUpdate({ target: lotto.id, set: input })
			.returning()
			.execute()) as Lotto[]
	}

	async batchCreate(input: CreateLottoInput[]): Promise<Lotto[]> {
		const data = Value.Parse(Array(LottoSchema), Value.Default(Array(LottoSchema), input))
		await this.db.insert(lotto).values(data).onConflictDoNothing().returning().execute()
		return data as Lotto[]
	}
}
// type Q<T extends Record<string, unknown>> = (order: 'asc' | 'desc', cursor: number, pageSize: number) => T
// interface R<T> {
// 	next?: string
// 	previous?: string
// 	result: T[]
// }

// type W<T extends Record<string, unknown>> = (cb: Q<T>) => R<T>

// const a = <T extends string>(value: T) => Buffer.from(value).toString('base64')
// // const b = <T extends string>(value: T) => Buffer.from(value, 'base64').toString()
// const c: W<{ id: string }> = (cb) => {
// 	const res = cb('asc', 3, 3)
// 	return {
// 		next: a(JSON.stringify(res)),
// 		result: res,
// 	}
// }

// const ww = c((a, b, c) => {
// 	console.log(a, b, c)
// 	return { id: '1sdds' }
// })

// const a = (a, v, c) => {

// }

// const a = (
// 	a: string,
// 	b: string,
// 	c: string,
// 	cb: (model: Record<string, string>, a: string, b: string, c: string) => Record<string, string>,
// ) => {
// 	return cb({}, a, b, c)
// }

// a('a', 'w', 'c', (model, a, b, c) => {
// 	console.log(a, b, c)
// 	return model
// })
