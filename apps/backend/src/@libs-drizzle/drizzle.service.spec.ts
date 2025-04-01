import { Test, TestingModule } from '@nestjs/testing'
import { pgTable, serial } from 'drizzle-orm/pg-core'
import { beforeEach, describe, expect, it } from 'vitest'
import { GenServiceTag } from './drizzle.decorator.js'
import { DrizzleModule } from './drizzle.module.js'
import { DrizzleService } from './drizzle.service.js'

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
		service = module.get(GenServiceTag('dev'))
	})

	it('get db success', () => {
		const db = service
		expect(db).toBeDefined()
	})
})
