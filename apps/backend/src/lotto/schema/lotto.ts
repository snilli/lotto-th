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
		last2Digi: varchar('last2_digi').notNull(),
		first3Digi: jsonb('first3_digi').$type<string[]>(),
		last3Digi: jsonb('last3_digi').notNull().$type<string[]>(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(lotto) => {
		return {
			idIdx: index('id_idx').on(sql`(${lotto.id}::date)`),
			yearIdx: index('year_idx').on(lotto.year),
			monthIdx: index('month_idx').on(lotto.month),
			dateIdx: index('date_idx').on(lotto.date),
			prize1Idx: index('prize1_idx').on(lotto.prize1),
			prize2Idx: index('prize2_index').using('gin', sql`${lotto.prize2} jsonb_ops`),
			prize3Idx: index('prize3_index').using('gin', sql`${lotto.prize3} jsonb_ops`),
			prize4Idx: index('prize4_index').using('gin', sql`${lotto.prize4} jsonb_ops`),
			prize5Idx: index('prize5_index').using('gin', sql`${lotto.prize5} jsonb_ops`),
			last2DigiIdx: index('last2_digi_idx').on(lotto.last2Digi),
			first3DigiIdx: index('first3_digi_index').using('gin', sql`${lotto.first3Digi} jsonb_ops`),
			last3DigiIdx: index('last3_digi_index').using('gin', sql`${lotto.last3Digi} jsonb_ops`),
		}
	},
)

// query multiple lotto check
// select
// t.number,
// CASE
//     WHEN l.prize1 = t.number THEN 'prize1'
//     WHEN l.prize2 @> jsonb_build_array(t.number) THEN 'prize2'
//     WHEN l.prize3 @> jsonb_build_array(t.number) THEN 'prize3'
//     WHEN l.prize4 @> jsonb_build_array(t.number) THEN 'prize4'
//     WHEN l.prize5 @> jsonb_build_array(t.number) THEN 'prize5'
//     WHEN l."last2Digi" = RIGHT(t.number, 2) THEN 'last2Digi'
//     WHEN l."first3Digi" @> jsonb_build_array(LEFT(t.number, 3)) THEN 'first3Digi'
//     WHEN l."last3Digi" @> jsonb_build_array(RIGHT(t.number, 3)) THEN 'last3Digi'
//     ELSE 'No prize'
// END AS prize_category
// from lotto l
// join unnest(ARRAY[$1]::text[]) as t(number) on l.id ='2024-06-16'
