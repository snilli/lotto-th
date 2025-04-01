import { LottoClientModule } from '@app/@libs-lotto-client/lotto-client.module.js'
import { Module } from '@nestjs/common'
import { LottoController } from './controller/lotto.controller.js'
import { LottoRepo } from './repo/lotto.repo.js'
import { LottoService } from './service/lotto.service.js'

@Module({
	imports: [LottoClientModule],
	providers: [LottoService, LottoRepo],
	controllers: [LottoController],
})
export class LottoModule {}
