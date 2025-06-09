export type GlobalLottoPrizeList =
	| 'prize1'
	| 'prize2'
	| 'prize3'
	| 'prize4'
	| 'prize5'
	| 'last-2digit'
	| 'first-3digit'
	| 'last-3Digit'
	| 'not-match'

export interface CheckGlobalPrizeResponse {
	number: string
	result: GlobalLottoPrizeList
}

export type CheckLocalPrizeKind = '2digit-global' | '2digit-local' | '3digit-global' | '3digit-local'
export type CheckLocalPrizeType = 'exactly' | 'ordering'

export interface CheckLocalPrizeInput {
	kind: CheckLocalPrizeKind
	type: CheckLocalPrizeType
	number: string
}

export interface CheckLocalPrizeResponse {
	number: string
	isWin: boolean
	kind: CheckLocalPrizeKind
	type: CheckLocalPrizeType
}
