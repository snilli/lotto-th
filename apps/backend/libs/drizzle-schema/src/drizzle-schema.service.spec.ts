import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { DrizzleSchemaModule } from './drizzle-schema.module'
import { DrizzleSchemaService } from './drizzle-schema.service'

describe('DrizzleSchemaService', () => {
	let service: DrizzleSchemaService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [DrizzleSchemaModule],
		}).compile()

		service = module.get<DrizzleSchemaService>(DrizzleSchemaService)
	})

	it('schema should befined', () => {
		expect(service).toBeDefined()
	})
})
