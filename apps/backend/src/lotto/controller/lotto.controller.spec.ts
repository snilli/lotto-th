import { DrizzleModule } from '@app/@libs-drizzle/drizzle.module.js'
import { LottoClientModule } from '@app/@libs-lotto-client/lotto-client.module.js'
import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { LottoRepo } from '../repo/lotto.repo.js'
import { schema } from '../schema/index.js'
import { LottoService } from '../service/lotto.service.js'
import { LottoController } from './lotto.controller.js'

describe('AppController', () => {
	let lottoController: LottoController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			imports: [
				DrizzleModule.register({
					config: { schema: schema },
					tag: 'vercel',
				}),
				LottoClientModule,
			],
			controllers: [LottoController],
			providers: [LottoRepo, LottoService],
		}).compile()

		lottoController = app.get<LottoController>(LottoController)
	})

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(lottoController).toBeDefined()
		})
	})
})
