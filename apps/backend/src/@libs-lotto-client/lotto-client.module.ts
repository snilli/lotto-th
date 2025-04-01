import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { LottoClientService } from './lotto-client.service.js'
import { LottoHttpConfigService } from './lotto.http-config.service.js'

@Module({
	imports: [
		HttpModule.registerAsync({
			useClass: LottoHttpConfigService,
		}),
	],
	providers: [LottoClientService],
	exports: [LottoClientService],
})
export class LottoClientModule {}
