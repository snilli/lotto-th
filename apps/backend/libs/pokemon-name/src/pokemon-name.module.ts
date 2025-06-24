import { Module } from '@nestjs/common'
import { PokemonNameService } from './pokemon-name.service'

@Module({
	providers: [PokemonNameService],
	exports: [PokemonNameService],
})
export class PokemonNameModule {}
