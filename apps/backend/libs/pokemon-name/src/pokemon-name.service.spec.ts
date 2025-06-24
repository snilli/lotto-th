import { Test, TestingModule } from '@nestjs/testing'
import { PokemonNameService } from './pokemon-name.service'
import { describe, beforeEach, it, expect } from 'vitest'

describe('PokemonNameService', () => {
	let service: PokemonNameService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PokemonNameService],
		}).compile()

		service = module.get<PokemonNameService>(PokemonNameService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
