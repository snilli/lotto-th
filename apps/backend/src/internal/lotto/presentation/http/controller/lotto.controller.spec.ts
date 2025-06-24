import { LottoService } from '@app/internal/lotto/application/service/lotto.service'
import { LottoRepository } from '@app/internal/lotto/domain/repository/lotto.repository'
import { DrizzleLottoRepository } from '@app/internal/lotto/infrastructure/postgres/repository/lotto.repository'
import { schema } from '@app/internal/lotto/infrastructure/postgres/schema/index'
import { LottoClientModule } from '@app/lotto-client'
import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { LottoController } from './lotto.controller'
import { DrizzleModule } from '@app/drizzle'

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
