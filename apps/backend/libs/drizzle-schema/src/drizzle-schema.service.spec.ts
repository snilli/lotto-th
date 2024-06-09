import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { DrizzleSchemaService } from './drizzle-schema.service'

describe('DrizzleSchemaService', () => {
	let service: DrizzleSchemaService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [DrizzleSchemaService],
		}).compile()

		service = module.get<DrizzleSchemaService>(DrizzleSchemaService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
