import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { schema } from '../schema/index'
import { DrizzleLottoRepository } from './lotto.repository'
import { DrizzleModule } from '@app/drizzle'

describe('LottoRepo', () => {
	let repo: DrizzleLottoRepository
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					envFilePath: ['.env.development.local', '.env.development'],
					isGlobal: true,
				}),
				DrizzleModule.register({
					tag: 'vercel',
					config: { schema: schema },
				}),
			],
			providers: [DrizzleLottoRepository],
		}).compile()

		repo = module.get<DrizzleLottoRepository>(DrizzleLottoRepository)
	})

	it('should be defined', async () => {
		const a = await repo.getById('2022-01-01')
		console.log(a)
		expect(repo).toBeDefined()
	})
})
