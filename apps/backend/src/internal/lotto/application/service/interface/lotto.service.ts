import {
	CheckLocalPrizeType,
	CheckLocalPrizeKind,
} from '@app/internal/lotto/domain/repository/interface/lotto.repository.js'

export interface CreateLottoServiceInput {
	id: string
	date: number
	year: number
	month: number
	prize1: string
	prize2: string[]
	prize3: string[]
	prize4: string[]
	prize5: string[]
	last2Digit: string
	first3Digit?: string[]
	last3Digit: string[]
}

export type CheckLottoPrizeDetailInput = {
	[type in CheckLocalPrizeType]?: string[]
}

export type CheckLocalPrizeServiceInput = {
	[kind in CheckLocalPrizeKind]?: CheckLottoPrizeDetailInput
}

export interface CheckLocalPrizeServiceResponse {
	number: string
	isWin: boolean
	kind: CheckLocalPrizeKind
	type: CheckLocalPrizeType
}
