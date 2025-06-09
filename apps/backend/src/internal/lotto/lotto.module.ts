import { LottoClientModule } from '@app/@libs-lotto-client/lotto-client.module'
import { Module } from '@nestjs/common'
import { LottoService } from './application/service/lotto.service'
import { LottoRepository } from './domain/repository/lotto.repository'
import { DrizzleLottoRepository } from './infrastructure/postgres/repository/lotto.repository'
import { LottoController } from './presentation/http/controller/lotto.controller'

@Module({
	imports: [LottoClientModule],
	providers: [LottoService, { provide: LottoRepository, useClass: DrizzleLottoRepository }],
	controllers: [LottoController],
})
export class LottoModule {}
