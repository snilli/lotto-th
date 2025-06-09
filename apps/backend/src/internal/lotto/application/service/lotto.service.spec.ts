import { DrizzleModule } from '@app/@libs-drizzle/drizzle.module.js'
import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { schema } from '../../infrastructure/postgres/schema/index.js'
import { LottoService } from './lotto.service.js'
import { DrizzleLottoRepository } from '../../infrastructure/postgres/repository/lotto.repository.js'

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
			providers: [DrizzleLottoRepository, LottoService],
		})
			.useMocker(() => {})
			.compile()

		service = module.get<LottoService>(LottoService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
