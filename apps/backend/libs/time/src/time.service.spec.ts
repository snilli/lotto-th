import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { TimeModule } from './time.module'
import { TimeService } from './time.service'

describe('TimeService', () => {
	let service: TimeService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [TimeModule],
		}).compile()

		service = module.get<TimeService>(TimeService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
