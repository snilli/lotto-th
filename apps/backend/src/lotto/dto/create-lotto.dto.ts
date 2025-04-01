import { Array, Composite, Object, Omit, Optional, Static, String } from '@sinclair/typebox'
import { createInsertSchema } from 'drizzle-typebox'
import { lotto } from '../schema/lotto.js'

export const LottoSchema = createInsertSchema(lotto)
LottoSchema.properties.first3Digit.default = null

export const CreateLotto = Composite([
	Omit(LottoSchema, ['createdAt', 'updatedAt', 'prize2', 'prize3', 'prize4', 'prize5', 'first3Digit', 'last3Digit']),
	Object({
		prize2: Array(String()),
		prize3: Array(String()),
		prize4: Array(String()),
		prize5: Array(String()),
		first3Digit: Optional(Array(String())),
		last3Digit: Array(String()),
	}),
])

export type CreateLotto = Static<typeof CreateLotto>
