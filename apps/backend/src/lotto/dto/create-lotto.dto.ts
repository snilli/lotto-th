import { extendApi } from '@anatine/zod-openapi'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { lotto } from '../schema/lotto'
export type CreateLottoOption = typeof lotto.$inferInsert
export const CreateLotto = extendApi(
	createInsertSchema(lotto, {
		prize2: z.string().array(),
		prize3: z.string().array(),
		prize4: z.string().array(),
		prize5: z.string().array(),
		first3Digi: z.string().array(),
		last3Digi: z.string().array(),
	}),
)
