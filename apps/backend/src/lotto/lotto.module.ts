import { FireormModule } from '@app/fireorm'
import { LottoClientModule } from '@app/lotto-client'
import { TimeModule } from '@app/time'
import { Module } from '@nestjs/common'
import { LottoController } from './lotto.controller'
import { LottoEntity } from './lotto.entity'
import { LottoService } from './lotto.service'

@Module({
	imports: [LottoClientModule, TimeModule, FireormModule.forFeature([LottoEntity])],
	providers: [LottoService],
	controllers: [LottoController],
})
export class LottoModule {}
