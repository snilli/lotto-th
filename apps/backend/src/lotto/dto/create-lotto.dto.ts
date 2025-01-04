import { Type } from '@sinclair/typebox'
import { createInsertSchema } from 'drizzle-typebox'
import { lotto } from '../schema/lotto'
export type CreateLottoOption = typeof lotto.$inferInsert

export const LottoSchema = createInsertSchema(lotto)
export const CreateLotto = Type.Composite([
	Type.Omit(LottoSchema, [
		'createdAt',
		'updatedAt',
		'prize2',
		'prize3',
		'prize4',
		'prize5',
		'first3Digi',
		'last3Digi',
	]),
	Type.Object({
		createdAt: Type.Date(),
		updatedAt: Type.Date(),
		prize2: Type.Array(Type.String()),
		prize3: Type.Array(Type.String()),
		prize4: Type.Array(Type.String()),
		prize5: Type.Array(Type.String()),
		first3Digi: Type.Array(Type.String()),
		last3Digi: Type.Array(Type.String()),
	}),
])
