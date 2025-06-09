import { LottoClientModule } from '@app/@libs-lotto-client/lotto-client.module.js'
import { Module } from '@nestjs/common'
import { LottoService } from './application/service/lotto.service.js'
import { DrizzleLottoRepository } from './infrastructure/postgres/repository/lotto.repository.js'
import { LottoController } from './presentation/http/controller/lotto.controller.js'
import { LottoRepository } from './domain/repository/lotto.repository.js'

@Module({
	imports: [LottoClientModule],
	providers: [LottoService, { provide: LottoRepository, useClass: DrizzleLottoRepository }],
	controllers: [LottoController],
})
export class LottoModule {}
