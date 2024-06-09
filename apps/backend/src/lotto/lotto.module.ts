import { LottoClientModule } from '@lib/lotto-client'
import { TimeModule } from '@lib/time'
import { Module } from '@nestjs/common'
import { LottoController } from './lotto.controller'
import { LottoService } from './lotto.service'

@Module({
	imports: [LottoClientModule, TimeModule],
	providers: [LottoService],
	controllers: [LottoController],
})
export class LottoModule {}
