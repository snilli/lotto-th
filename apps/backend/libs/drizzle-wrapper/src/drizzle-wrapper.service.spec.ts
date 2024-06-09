import { Test, TestingModule } from '@nestjs/testing'
import { pgTable, serial } from 'drizzle-orm/pg-core'
import { beforeEach, describe, expect, it } from 'vitest'
import { DrizzleWrapperModule } from './drizzle-wrapper.module'
import { DrizzleWrapperService } from './drizzle-wrapper.service'

const schema = {
	users: pgTable('users', {
		id: serial('id').primaryKey(),
	}),
}

describe('DrizzlePGService', () => {
	let service: DrizzleWrapperService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [DrizzleWrapperModule.register({ tag: 'dev' })],
		}).compile()
		service = module.get<DrizzleWrapperService>(DrizzleWrapperService)
	})

	it('get db success', async () => {
		const db = await service.getDrizzle<typeof schema>({
			config: {
				schema,
			},
		})
		expect(db).toBeDefined()
	})
})
