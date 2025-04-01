import { Injectable } from '@nestjs/common'
import { CreateLotto } from '../dto/create-lotto.dto.js'
import type { PrizeCheck, PrizeCheckLocalTypeDetail } from '../dto/prize-check.dto.js'
import type {
	CreateLottoInput,
	PrizeCheckLocalInput,
	PrizeCheckLocalKind,
	PrizeCheckLocalType,
} from '../repo/interfaces.js'
import { LottoRepo } from '../repo/lotto.repo.js'

@Injectable()
export class LottoService {
	constructor(private readonly lottoRepo: LottoRepo) {}

	async getById(id: string) {
		return await this.lottoRepo.getById(id)
	}

	async create(data: CreateLotto) {
		return await this.lottoRepo.create(data)
	}

	async batchCreate(input: CreateLottoInput[]) {
		return await this.lottoRepo.batchCreate(input)
	}

	async prizeCheck(date: string, payload: PrizeCheck) {
		if (payload.type === 'global') {
			return await this.lottoRepo.prizeCheckGlobal(date, payload.numbers)
		}

		const input: PrizeCheckLocalInput[] = []
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { type, ...rest } = payload
		for (const [kind, value] of Object.entries(rest) as [PrizeCheckLocalKind, PrizeCheckLocalTypeDetail][]) {
			for (const [type, numbers] of Object.entries(value) as [PrizeCheckLocalType, string[]][]) {
				for (const num of numbers) {
					input.push({
						kind,
						type,
						number: num,
					})
				}
			}
		}

		if (!input.length) {
			return
		}

		return await this.lottoRepo.prizeCheckLocal(date, input)
	}
}
