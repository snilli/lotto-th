import { LottoClientModule } from '@app/lotto-client'
import { PokemonNameModule } from '@app/pokemon-name'
import { Module } from '@nestjs/common'
import { LottoService } from './application/service/lotto.service'
import { LottoRepository } from './domain/repository/lotto.repository'
import { DrizzleLottoRepository } from './infrastructure/postgres/repository/lotto.repository'
import { LottoController } from './presentation/http/controller/lotto.controller'

@Module({
	imports: [LottoClientModule, PokemonNameModule],
	providers: [LottoService, { provide: LottoRepository, useClass: DrizzleLottoRepository }],
	controllers: [LottoController],
})
export class LottoModule {}
