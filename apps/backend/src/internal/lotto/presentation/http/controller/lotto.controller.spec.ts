import { DrizzleModule } from '@app/@libs-drizzle/drizzle.module.js'
import { LottoClientModule } from '@app/@libs-lotto-client/lotto-client.module.js'
import { LottoService } from '@app/internal/lotto/application/service/lotto.service.js'
import { LottoRepository } from '@app/internal/lotto/domain/repository/lotto.repository.js'
import { schema } from '@app/internal/lotto/infrastructure/postgres/schema/index.js'
import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { LottoController } from './lotto.controller.js'
import { DrizzleLottoRepository } from '@app/internal/lotto/infrastructure/postgres/repository/lotto.repository.js'

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
			providers: [{ provide: LottoRepository, useClass: DrizzleLottoRepository }, LottoService],
		}).compile()

		lottoController = app.get<LottoController>(LottoController)
	})

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(lottoController).toBeDefined()
		})
	})
})
