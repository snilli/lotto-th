import { Test, TestingModule } from '@nestjs/testing'
import { pgTable, serial } from 'drizzle-orm/pg-core'
import { beforeEach, describe, expect, it } from 'vitest'
import { GenServiceTag } from './drizzle.decorator'
import { DrizzleModule } from './drizzle.module'
import { DrizzleService } from './drizzle.service'

const schema = {
	users: pgTable('users', {
		id: serial('id').primaryKey(),
	}),
}

describe('DrizzlePGService', () => {
	let service: DrizzleService<typeof schema>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [DrizzleModule.register({ tag: 'dev', config: { schema } })],
		}).compile()
		service = module.get(GenServiceTag('dev')) as DrizzleService<typeof schema>
	})

	it('get db success', async () => {
		const db = await service.getDrizzle()
		expect(db).toBeDefined()
	})
})
