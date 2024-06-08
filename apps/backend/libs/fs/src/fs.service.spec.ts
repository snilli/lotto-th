import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { FsService } from './fs.service'
import { getFsToken } from './utils/fs-token'

describe('FsService', () => {
	let service: FsService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: getFsToken('json'),
					useFactory() {
						return new FsService(getFsToken('json'))
					},
				},
			],
		}).compile()

		service = module.get<FsService>(getFsToken('json'))
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
