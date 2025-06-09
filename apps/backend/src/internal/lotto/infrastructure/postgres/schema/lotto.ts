import { sql } from 'drizzle-orm'
import { date, index, integer, jsonb, pgTable, smallint, timestamp, varchar } from 'drizzle-orm/pg-core'

export const lotto = pgTable(
	'lotto',
	{
		id: date('id', { mode: 'string' }).primaryKey(),
		year: integer('year').notNull(),
		month: smallint('month').notNull(),
		date: smallint('date').notNull(),
		prize1: varchar('prize1').notNull(),
		prize2: jsonb('prize2').notNull().$type<string[]>(),
		prize3: jsonb('prize3').notNull().$type<string[]>(),
		prize4: jsonb('prize4').notNull().$type<string[]>(),
		prize5: jsonb('prize5').notNull().$type<string[]>(),
		last2Digit: varchar('last2_digit').notNull(),
		first3Digit: jsonb('first3_digit').$type<string[]>(),
		last3Digit: jsonb('last3_digit').notNull().$type<string[]>(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(lotto) => [
		index('id_idx').on(sql`(${lotto.id}::date)`),
		index('year_idx').on(lotto.year),
		index('month_idx').on(lotto.month),
		index('date_idx').on(lotto.date),
		index('prize1_idx').on(lotto.prize1),
		index('prize2_index').using('gin', sql`${lotto.prize2} jsonb_ops`),
		index('prize3_index').using('gin', sql`${lotto.prize3} jsonb_ops`),
		index('prize4_index').using('gin', sql`${lotto.prize4} jsonb_ops`),
		index('prize5_index').using('gin', sql`${lotto.prize5} jsonb_ops`),
		index('last2_digit_idx').on(lotto.last2Digit),
		index('first3_digit_index').using('gin', sql`${lotto.first3Digit} jsonb_ops`),
		index('last3_digit_index').using('gin', sql`${lotto.last3Digit} jsonb_ops`),
	],
)
