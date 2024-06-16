import { LottoClientModule } from '@app/@libs-lotto-client/lotto-client.module'
import { Module } from '@nestjs/common'
import { LottoController } from './controller/lotto.controller'
import { LottoRepo } from './repo/lotto.repo'
import { LottoService } from './service/lotto.service'

@Module({
	imports: [LottoClientModule],
	providers: [LottoService, LottoRepo],
	controllers: [LottoController],
})
export class LottoModule {}
