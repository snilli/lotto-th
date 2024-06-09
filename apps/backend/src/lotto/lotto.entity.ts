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

export class LottoEntity {
	private state?: {
		id: string
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
	}
	private adjacentNumber() {
		const prize1 = Number(this.state!.prizeList.prize1)
		return [String(prize1 - 1), String(prize1 + 1)]
	}

	private setPrizeMap(prizeMap: Map<string, prizeType>, prizeList: string[], prizeType: prizeType) {
		for (const prize of prizeList) {
			prizeMap.set(prize, prizeType)
		}
	}

	scanPrize(number: string): prizeType | undefined {
		const prizeMap: Map<string, prizeType> = new Map()
		prizeMap.set(this.state!.prizeList.prize1, 'prize1')
		prizeMap.set(this.state!.prizeList.last2Digi, 'last2Digi')
		this.setPrizeMap(prizeMap, this.adjacentNumber(), 'adjacentNumber')
		prizeMap.set(this.state!.prizeList.prize1.substring(4, 6), 'last2DigiPrize1')
		this.setPrizeMap(prizeMap, this.state!.prizeList.prize2, 'prize2')
		this.setPrizeMap(prizeMap, this.state!.prizeList.prize3, 'prize3')
		this.setPrizeMap(prizeMap, this.state!.prizeList.prize4, 'prize4')
		this.setPrizeMap(prizeMap, this.state!.prizeList.prize5, 'prize5')
		this.setPrizeMap(prizeMap, this.state!.prizeList.last3Digi, 'last3Digi')
		this.setPrizeMap(prizeMap, this.state!.prizeList.first3Digi ?? [], 'first3Digi')

		return prizeMap.get(number)
	}
}
