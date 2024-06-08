import { FsModule } from '@lib/fs'
import { HttpModule } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { ScrapeCardHttpConfigService } from './scrape-card.http-config.service'
import { ScrapeCardService } from './scrape-card.service'

describe('ScrapeCardService', () => {
	let service: ScrapeCardService
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				FsModule.forFeature(['json', 'image']),
				HttpModule.registerAsync({
					useClass: ScrapeCardHttpConfigService,
				}),
			],
			providers: [ScrapeCardService],
		}).compile()

		service = module.get<ScrapeCardService>(ScrapeCardService)
	})

	it('get all card', async () => {
		const card = await service.getAll()
		expect(card).length(301)
	})

	it('get images', { timeout: 500000 }, async () => {
		await service.getImages()
	})

	it('updateDigimonMaterial', async () => {
		await service.updateDigimonMaterial()
	})

	it('a', async () => {
		await service.a()
	})
})
