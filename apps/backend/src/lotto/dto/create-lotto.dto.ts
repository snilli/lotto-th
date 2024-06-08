export interface CreateLottoInput {
	year: number
	month: number
	date: number
	weekly: string
	prizeList: {
		prize1: string
		prize2: string[]
		prize3: string[]
		prize4: string[]
		prize5: string[]
		last2Digi: string
		first3Digi?: string[]
		last3Digi: string[]
	}
}
