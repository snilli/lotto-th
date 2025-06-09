import { z } from 'zod/v4'

export const CursorBase = <T extends z.ZodTypeAny>(data: T) => {
	return z.object({
		next: z.string(),
		prev: z.string(),
		data,
	})
}
