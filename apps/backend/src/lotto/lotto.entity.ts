import { Collection } from '@snilli/fireorm'

type prizeType =
	| 'prize1'
	| 'prize2'
	| 'prize3'
	| 'prize4'
	| 'prize5'
	| 'last2Digi'
	| 'first3Digi'
	| 'last3Digi'
	| 'adjacentNumber'
	| 'last2DigiPrize1'

@Collection('lotto')
export class LottoEntity {
	id!: string
	year: number
	month: number
	date: number
	timestamp: number
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

	private adjacentNumber() {
		const prize1 = Number(this.prizeList.prize1)
		return [String(prize1 - 1), String(prize1 + 1)]
	}

	private setPrizeMap(prizeMap: Map<string, prizeType>, prizeList: string[], prizeType: prizeType) {
		for (const prize of prizeList) {
			prizeMap.set(prize, prizeType)
		}
	}

	scanPrize(number: string): prizeType | undefined {
		const prizeMap: Map<string, prizeType> = new Map()
		prizeMap.set(this.prizeList.prize1, 'prize1')
		prizeMap.set(this.prizeList.last2Digi, 'last2Digi')
		this.setPrizeMap(prizeMap, this.adjacentNumber(), 'adjacentNumber')
		prizeMap.set(this.prizeList.prize1.substring(4, 6), 'last2DigiPrize1')
		this.setPrizeMap(prizeMap, this.prizeList.prize2, 'prize2')
		this.setPrizeMap(prizeMap, this.prizeList.prize3, 'prize3')
		this.setPrizeMap(prizeMap, this.prizeList.prize4, 'prize4')
		this.setPrizeMap(prizeMap, this.prizeList.prize5, 'prize5')
		this.setPrizeMap(prizeMap, this.prizeList.last3Digi, 'last3Digi')
		this.setPrizeMap(prizeMap, this.prizeList.first3Digi ?? [], 'first3Digi')

		return prizeMap.get(number)
	}
}
