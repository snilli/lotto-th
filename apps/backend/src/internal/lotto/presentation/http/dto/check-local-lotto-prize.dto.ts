import { createZodDto } from 'nestjs-zod'
import { z } from 'zod/v4'

const lottoType = z
	.object({
		exactly: z.array(z.string()).optional(),
		ordering: z.array(z.string()).optional(),
	})
	.strict()
	.check((ctx) => {
		if (!ctx.value.exactly && !ctx.value.ordering) {
			ctx.issues.push({
				code: 'custom',
				input: ctx.value,
				message: 'Should provide one of [exactly, ordering] value',
			})
		}
	})

const checkLocalLottoPrizeBodySchema = z
	.object({
		'2digit-global': lottoType.optional(),
		'2digit-local': lottoType.optional(),
		'3digit-global': lottoType.optional(),
		'3digit-local': lottoType.optional(),
	})
	.strict()
	.check((ctx) => {
		const hasDigitConfig =
			ctx.value['2digit-global'] ||
			ctx.value['2digit-local'] ||
			ctx.value['3digit-global'] ||
			ctx.value['3digit-local']

		if (!hasDigitConfig) {
			ctx.issues.push({
				code: 'custom',
				input: ctx.value,
				message:
					'Should provide one or more there [2digit-global, 2digit-local, 3digit-global, 3digit-local] value',
			})
		}
	})

export class CheckLocalLottoPrizeBody extends createZodDto(checkLocalLottoPrizeBodySchema) {}

const checkLocalLottoPrizeParamSchema = z.object({
	date: z.iso.date(),
})

export class CheckLocalLottoPrizeParam extends createZodDto(checkLocalLottoPrizeParamSchema) {}

const checkLocalLottoPrizeResponseSchema = z
	.object({
		number: z.string(),
		isWin: z.boolean(),
		type: z.enum(['exactly', 'ordering']),
		kind: z.enum(['2digit-global', '2digit-local', '3digit-global', '3digit-local']),
	})
	.strict()

export class CheckLocalLottoPrizeResponse extends createZodDto(checkLocalLottoPrizeResponseSchema) {}
