import { lotto } from '../schema/lotto.js'

export type CreateLottoInput = typeof lotto.$inferInsert

export type PrizeCheckLocalKind = '2digit-global' | '2digit-local' | '3digit-global' | '3digit-local'
export type PrizeCheckLocalType = 'exactly' | 'ordering'
export interface PrizeCheckLocalInput {
	kind: '2digit-global' | '2digit-local' | '3digit-global' | '3digit-local'
	type: 'exactly' | 'ordering'
	number: string
}
