export interface WeeklyPrizeModel {
	year: number
	month: number
	date: number
	weekly: string
	detailUrl: string
	prizeList: {
		prize1: string
		prize2: string[]
		prize3: string[]
		prize4: string[]
		prize5: string[]
		last2Digit: string
		first3Digit?: string[]
		last3Digit: string[]
	}
}

export interface DateExtraction {
	year: number
	month: number
	date: number
	weekly: string
}
