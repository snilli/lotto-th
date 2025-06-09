import { BaseAggregate } from '@app/internal/share/domain/base.aggregate'
import { CreateLottoInput, Lotto } from './interface/lotto.aggregate'

export class LottoAggregate implements BaseAggregate<Lotto> {
	private readonly id: string
	private date: number
	private year: number
	private month: number
	private prize1: string
	private prize2: string[]
	private prize3: string[]
	private prize4: string[]
	private prize5: string[]
	private last2Digit: string
	private first3Digit?: string[]
	private last3Digit: string[]
	private createdAt?: Date
	private updatedAt?: Date

	constructor(input: CreateLottoInput) {
		this.id = input.id
		this.date = input.date
		this.year = input.year
		this.month = input.month
		this.prize1 = input.prize1
		this.prize2 = input.prize2
		this.prize3 = input.prize3
		this.prize4 = input.prize4
		this.prize5 = input.prize5
		this.last2Digit = input.last2Digit
		this.first3Digit = input.first3Digit
		this.last3Digit = input.last3Digit
		this.createdAt = input.createdAt
		this.updatedAt = input.updatedAt
	}

	toJson(): Lotto {
		return {
			id: this.id,
			date: this.date,
			year: this.year,
			month: this.month,
			prize1: this.prize1,
			prize2: this.prize2,
			prize3: this.prize3,
			prize4: this.prize4,
			prize5: this.prize5,
			last2Digit: this.last2Digit,
			first3Digit: this.first3Digit,
			last3Digit: this.last3Digit,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		}
	}

	getId() {
		return this.id
	}
}
