import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { LottoClientService } from './lotto-client.service'

describe('LottoClientService', () => {
	let service: LottoClientService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [LottoClientService],
		}).compile()

		service = module.get<LottoClientService>(LottoClientService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
