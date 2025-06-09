import { LottoClientService } from '@app/lotto-client/lotto-client.service'
import { Inject, Injectable } from '@nestjs/common'
import { LottoAggregate } from '../../domain/entity/lotto.aggregate'
import {
	CheckLocalPrizeInput,
	CheckLocalPrizeKind,
	CheckLocalPrizeType,
} from '../../domain/repository/interface/lotto.repository'
import { LottoRepository } from '../../domain/repository/lotto.repository'
import {
	CheckLocalPrizeServiceInput,
	CheckLottoPrizeDetailInput,
	CreateLottoServiceInput,
} from './interface/lotto.service'

@Injectable()
export class LottoService {
	constructor(
		@Inject(LottoRepository) private readonly lottoRepo: LottoRepository,
		private readonly lottoClientService: LottoClientService,
	) {}

	async getCurrent() {
		const { prizeList, ...lotto } = await this.lottoClientService.getCurrent()

		let res = await this.getById(lotto.weekly)
		if (!res) {
			res = await this.create({
				id: lotto.weekly,
				date: lotto.date,
				year: lotto.year,
				month: lotto.month,
				prize1: prizeList.prize1,
				prize2: prizeList.prize2,
				prize3: prizeList.prize3,
				prize4: prizeList.prize4,
				prize5: prizeList.prize5,
				last2Digit: prizeList.last2Digit,
				last3Digit: prizeList.last3Digit,
				first3Digit: prizeList.first3Digit,
			})
		}

		return res
	}

	async getById(id: string) {
		return await this.lottoRepo.getById(id)
	}

	async create(input: CreateLottoServiceInput) {
		const agg = new LottoAggregate({
			id: input.id,
			date: input.date,
			year: input.year,
			month: input.month,
			prize1: input.prize1,
			prize2: input.prize2,
			prize3: input.prize3,
			prize4: input.prize4,
			prize5: input.prize5,
			last2Digit: input.last2Digit,
			first3Digit: input.first3Digit,
			last3Digit: input.last3Digit,
		})
		return await this.lottoRepo.create(agg)
	}

	async batchCreate(inputs: CreateLottoServiceInput[]) {
		const aggs = inputs.map(
			(input) =>
				new LottoAggregate({
					id: input.id,
					date: input.date,
					year: input.year,
					month: input.month,
					prize1: input.prize1,
					prize2: input.prize2,
					prize3: input.prize3,
					prize4: input.prize4,
					prize5: input.prize5,
					last2Digit: input.last2Digit,
					first3Digit: input.first3Digit,
					last3Digit: input.last3Digit,
				}),
		)
		return await this.lottoRepo.batchCreate(aggs)
	}

	async checkGlobalPrize(date: string, numbers: string[]) {
		return await this.lottoRepo.checkGlobalPrize(date, numbers)
	}

	async checkLocalPrize(date: string, input: CheckLocalPrizeServiceInput) {
		const rInput: CheckLocalPrizeInput[] = []
		for (const [kind, value] of Object.entries(input) as [CheckLocalPrizeKind, CheckLottoPrizeDetailInput][]) {
			for (const [type, numbers] of Object.entries(value) as [CheckLocalPrizeType, string[]][]) {
				for (const num of numbers) {
					rInput.push({
						kind,
						type,
						number: num,
					})
				}
			}
		}

		if (!rInput.length) {
			return
		}

		return await this.lottoRepo.checkLocalPrize(date, rInput)
	}
}
