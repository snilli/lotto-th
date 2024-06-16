import { DrizzleModule } from '@app/@libs-drizzle/drizzle.module'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { schema } from '../schema'
import { LottoRepo } from './lotto.repo'

describe('LottoRepo', () => {
	let repo: LottoRepo
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
			providers: [LottoRepo],
		}).compile()

		repo = module.get<LottoRepo>(LottoRepo)
	})

	it('should be defined', async () => {
		const a = await repo.getById('2022-01-01')
		console.log(a)
		expect(repo).toBeDefined()
	})
})
