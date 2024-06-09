import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { DrizzleWrapperService } from './drizzle-wrapper.service'

describe('DrizzlePGService', () => {
	let service: DrizzleWrapperService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [DrizzleWrapperService],
		}).compile()

		service = module.get<DrizzleWrapperService>(DrizzleWrapperService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
