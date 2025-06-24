import { Module } from '@nestjs/common'
import { LottoClientService } from './lotto-client.service'

@Module({
	providers: [LottoClientService],
	exports: [LottoClientService],
})
export class LottoClientModule {}
