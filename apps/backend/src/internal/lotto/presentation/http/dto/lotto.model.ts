import { createZodDto } from 'nestjs-zod'
import { z } from 'zod/v4'

const lottoModelSchema = z.object({
	date: z.string(),
	prize1: z.string(),
	prize2: z.array(z.string()),
	prize3: z.array(z.string()),
	prize4: z.array(z.string()),
	prize5: z.array(z.string()),
	last2Digit: z.string(),
	first3Digit: z.array(z.string()).optional(),
	last3Digit: z.array(z.string()),
})

export type LottoModel = z.infer<typeof lottoModelSchema>

export class LottoModelDTO extends createZodDto(lottoModelSchema) {}

const globalLottoModelSchema = z.object({
	number: z.string(),
	result: z.enum([
		'prize1',
		'prize2',
		'prize3',
		'prize4',
		'prize5',
		'last-2digit',
		'first-3digit',
		'last-3Digit',
		'not-match',
	]),
})

export class GlobalLottoModelListDTO extends createZodDto(z.array(globalLottoModelSchema)) {}

const localLottoModelSchema = z.object({
	number: z.string(),
	isWin: z.boolean(),
	kind: z.enum(['2digit-global', '2digit-local', '3digit-global', '3digit-local']),
	type: z.enum(['exactly', 'ordering']),
})

export class LocalLottoModelListDTO extends createZodDto(z.array(localLottoModelSchema)) {}
