import { InjectDbTag } from '@app/@libs-drizzle/drizzle.decorator'
import { DrizzleMainRepo } from '@app/@libs-drizzle/drizzle.repo'
import { schemaType } from '@app/schema'
import { Injectable } from '@nestjs/common'
import { sql } from 'drizzle-orm'
import { VercelPgDatabase } from 'drizzle-orm/vercel-postgres'
import { CreateLotto, CreateLottoOption } from '../dto/create-lotto.dto'
import { lotto } from '../schema'

@Injectable()
export class LottoRepo extends DrizzleMainRepo<schemaType> {
	constructor(@InjectDbTag('vercel') protected readonly db: VercelPgDatabase<schemaType>) {
		super()
	}
	getById(id: string) {
		return this.db.query.lotto.findFirst({
			where: (fields, operators) => operators.eq(fields.id, id),
		})
	}

	getAllById(ids: string[]) {
		return this.db.query.lotto.findMany({
			where: (fields, operators) => operators.inArray(fields.id, ids),
		})
	}

	async prizeCheck(date: string, lottos: string[]) {
		// WHEN ${lotto.last2Digi} = RIGHT(t.number, 2) THEN 'last2Digi'
		const a = this.db
			.select({
				lotto: sql`t.number`.as<string>('lotto'),
				result: sql`CASE
					WHEN ${lotto.prize1} = t.number THEN 'prize1'
					WHEN ${lotto.prize2} @> jsonb_build_array(t.number) THEN 'prize2'
					WHEN ${lotto.prize3} @> jsonb_build_array(t.number) THEN 'prize3'
					WHEN ${lotto.prize4} @> jsonb_build_array(t.number) THEN 'prize4'
					WHEN ${lotto.prize5} @> jsonb_build_array(t.number) THEN 'prize5'
					WHEN ${lotto.last2Digi} = RIGHT(t.number, 2) THEN 'last2Digi'
					WHEN ${lotto.first3Digi} @> jsonb_build_array(LEFT(t.number, 3)) THEN 'first3Digi'
					WHEN ${lotto.last3Digi} @> jsonb_build_array(RIGHT(t.number, 3)) THEN 'last3Digi'
					ELSE 'No prize'
				END
				`.as<string>('result'),
			})
			.from(lotto)
			.innerJoin(
				sql`unnest(ARRAY[${sql.raw(lottos.map((l) => `'${l}'`).join(','))}]::text[]) as t(number)`,
				sql`${lotto.id} = ${date}`,
			)

		console.log(a.toSQL())

		return await a
	}

	create(input: CreateLottoOption) {
		const data = CreateLotto.parse(input)

		return this.db.insert(lotto).values(data).onConflictDoUpdate({ target: lotto.id, set: data }).returning()
	}

	async batchCreate(input: CreateLottoOption[]) {
		const data = input.map((i) => CreateLotto.parse(i))
		await this.db.insert(lotto).values(data).onConflictDoNothing().returning()
		// await this.db.transaction(async (tx) => {
		// 	for (const d of data) {
		// 		await tx.insert(lotto).values(d).onConflictDoNothing().returning()
		// 	}
		// })
		return data
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
