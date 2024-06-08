import { FsModule } from '@lib/fs'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ScrapeCardHttpConfigService } from './scrape-card.http-config.service'
import { ScrapeCardService } from './scrape-card.service'

@Module({
	imports: [
		FsModule.forFeature(['json', 'image']),
		HttpModule.registerAsync({
			useClass: ScrapeCardHttpConfigService,
		}),
	],
	providers: [ScrapeCardService],
	exports: [ScrapeCardService],
})
export class ScrapeCardModule {}
