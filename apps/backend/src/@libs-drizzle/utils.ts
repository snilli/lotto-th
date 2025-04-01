import { Object, String, TSchema } from '@sinclair/typebox'

export const CursorBase = (data: TSchema) => {
	return Object({
		next: String(),
		prev: String(),
		data,
	})
}
