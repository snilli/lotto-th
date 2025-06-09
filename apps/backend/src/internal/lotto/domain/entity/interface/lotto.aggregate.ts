export interface CreateLottoInput {
	readonly id: string
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
	createdAt?: Date
	updatedAt?: Date
}

export interface Lotto {
	readonly id: string
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
	createdAt?: Date
	updatedAt?: Date
}
