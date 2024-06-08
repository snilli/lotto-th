import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { LottoController } from './lotto.controller'
import { LottoService } from './lotto.service'

describe('AppController', () => {
	let lottoController: LottoController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [LottoController],
			providers: [LottoService],
		}).compile()

		lottoController = app.get<LottoController>(LottoController)
	})

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(lottoController.getA(1)).toBe('Hello World!')
			console.log(12312)
		})
	})
})
