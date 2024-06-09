import { date, index, integer, jsonb, pgTable, smallint, timestamp, varchar } from 'drizzle-orm/pg-core'

export const lottoTable = pgTable(
	'lotto',
	{
		id: date('id', { mode: 'string' }).primaryKey(),
		year: integer('year').notNull(),
		month: smallint('month').notNull(),
		date: smallint('date').notNull(),
		weekly: smallint('weekly').notNull(),
		prize1: varchar('prize1').notNull(),
		prize2: jsonb('prize2').notNull().$type<string[]>(),
		prize3: jsonb('prize3').notNull().$type<string[]>(),
		prize4: jsonb('prize4').notNull().$type<string[]>(),
		prize5: jsonb('prize5').notNull().$type<string[]>(),
		last2Digi: varchar('last2Digi').notNull(),
		first3Digi: jsonb('first3Digi').$type<string[]>(),
		last3Digi: jsonb('last3Digi').notNull().$type<string[]>(),
		createdAt: timestamp('createdAt').defaultNow().notNull(),
	},
	(users) => {
		return {
			yearIdx: index('year_idx').on(users.year),
			monthIdx: index('month_idx').on(users.month),
			dateIdx: index('date_idx').on(users.date),
			weeklyIdx: index('weekly_idx').on(users.weekly),
		}
	},
)
