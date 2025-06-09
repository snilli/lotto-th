import { createZodDto } from 'nestjs-zod'
import { z } from 'zod/v4'

const checkGlobalLottoPrizeBodySchema = z
	.object({
		numbers: z.array(z.string()),
	})
	.strict()

export class CheckGlobalLottoPrizeBody extends createZodDto(checkGlobalLottoPrizeBodySchema) {}

const checkGlobalLottoPrizeParamSchema = z.object({
	date: z.iso.date(),
})

export class CheckGlobalLottoPrizeParam extends createZodDto(checkGlobalLottoPrizeParamSchema) {}

const checkGlobalLottoPrizeResponseSchema = z
	.object({
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
	.strict()

export class CheckGlobalLottoPrizeResponse extends createZodDto(checkGlobalLottoPrizeResponseSchema) {}
