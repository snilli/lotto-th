import { DrizzleModule } from '@app/@libs-drizzle/drizzle.module'
import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { LottoRepo } from '../repo/lotto.repo'
import { schema } from '../schema'
import { LottoService } from './lotto.service'

describe('LottoService', () => {
	let service: LottoService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				DrizzleModule.register({
					config: { schema: schema },
					tag: 'vercel',
				}),
			],
			providers: [LottoRepo, LottoService],
		})
			.useMocker(() => {})
			.compile()

		service = module.get<LottoService>(LottoService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
