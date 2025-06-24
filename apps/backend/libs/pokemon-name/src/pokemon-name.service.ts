import { Injectable } from '@nestjs/common'
import { Cheerio, CheerioAPI, fromURL } from 'cheerio'
import { Element } from 'domhandler'
interface PokemonApility {
	name: string
	detial: string
}
interface PokemonDetail {
	no: string
	img: string
	eng: string
	jap: string
	hepburn: string
	trademarked: string
	generation: number
	href: string
	types: string[]
	total: number
	hp: number
	atk: number
	def: number
	spAtk: number
	spDef: number
	speed: number

	species: string
	height: string
	weight: string
	abilities: PokemonApility[]
	hiddenAbility?: PokemonApility
	ev: string[]
	catchRate: string
	baseFriendShip: string
	baseExp: string
	growthRate: string
	eggGroups: string[]
	gender: string
	eggCycles: string
}

// const baseUrl = 'https://pokemondb.net'

@Injectable()
export class PokemonNameService {
	constructor() {}

	async getAll() {
		const [pokemons, abi] = await Promise.all([this.initPokemon(), this.getAbility()])
		const map = new Map<string, PokemonDetail>()
		for (const pokemon of pokemons) {
			map.set(pokemon.no, pokemon)
		}

		await this.getStat(map)
		// const pokemonDetailPages: Promise<void>[] = []
		// for (const pokemon of map.values()) {
		// 	pokemonDetailPages.push(this.mappingDetail(pokemon))
		// }

		// await Promise.all(pokemonDetailPages)
		const a = map.get('0006')!
		await this.mappingDetail(a, abi)

		// const chunked = this.chunk(pokemons)
		// chunked.length = 1
		// chunked[0].length = 1
		// const a = []
		// for (const pokemons of chunked) {
		// 	const htmls = await Promise.all(pokemons.map((pokemon) => fromURL(baseUrl + pokemon.href)))
		// 	for (const [idx, $] of htmls.entries()) {
		// 		console.log($('.roundy.infobox').find('table.roundy').length)
		// 	}
		// 	// a.push(...ww)
		// }

		return []
	}

	private chunk(pokemon: PokemonDetail[]): PokemonDetail[][] {
		const res: PokemonDetail[][] = []
		while (pokemon.length) {
			res.push(pokemon.splice(0, 200))
		}

		return res
	}

	private async mappingDetail(pokemon: PokemonDetail, abi: Map<string, string>) {
		const $ = await fromURL(pokemon.href)
		const q = $('.tabset-basics')
			.find('.sv-tabs-panel')
			.each((idx, panel) => {
				if (idx == 0) {
					this.extractPanel($, $(panel), pokemon, abi)
				}
			})
	}

	private extractPanel($: CheerioAPI, panel: Cheerio<Element>, pokemon: PokemonDetail, abi: Map<string, string>) {
		const gridCol = panel.find('.grid-col')
		pokemon.img = gridCol.eq(0).find('img').attr('src')!
		const dataTr = gridCol.eq(1).find('tr')
		const trainTr = gridCol.eq(3).find('tr')

		const abiTr = dataTr.eq(5).find('td')
		pokemon.types = dataTr.eq(1).find('td').text().trim().split('\t\t\t')
		pokemon.species = dataTr.eq(2).find('td').text().trim()
		pokemon.height = dataTr.eq(3).find('td').text().trim()
		pokemon.weight = dataTr.eq(4).find('td').text().trim()
		pokemon.abilities = abiTr
			.find('span > a')
			.map((_, a) => {
				const name = $(a).text().trim()
				return { name: name, detial: abi.get(name)! }
			})
			.get()
		pokemon.hiddenAbility = abiTr
			.find('small > a')
			.map((_, a) => {
				const name = $(a).text().trim()
				return { name: name, detial: abi.get(name)! }
			})
			.get()
			.pop()

		pokemon.ev = ''
		pokemon.catchRate = ''
		pokemon.baseFriendShip = ''
		pokemon.baseExp = ''
		pokemon.growthRate = ''
		pokemon.eggGroups = ''
		pokemon.gender = ''
		pokemon.eggCycles = ''
		console.log(trainTr.eq(2).find('td').text().trim())
	}

	private async initPokemon() {
		const $ = await fromURL('https://bulbapedia.bulbagarden.net/wiki/List_of_Japanese_Pok%C3%A9mon_names')
		return $('.roundy.roundtable')
			.map((idx, tableEl) => {
				return $(tableEl)
					.find('tr')
					.filter((i) => i > 1)
					.map((_, tr) => {
						const td = $(tr).find('td')
						return {
							no: td.eq(0).text().trim().replace('#', ''),
							// img: td.eq(1).find('img').attr('src')?.replace('70px', '250px'),
							eng: td.eq(2).text().trim(),
							jap: td.eq(3).text().trim(),
							hepburn: td.eq(4).text().trim(),
							trademarked: td.eq(5).text().trim(),
							generation: idx + 1,
						} as PokemonDetail
					})
					.get()
			})
			.get()
	}

	private async getStat(pokemonMap: Map<string, PokemonDetail>) {
		const $ = await fromURL('https://pokemondb.net/pokedex/all')
		$('#pokedex')
			.find('tr')
			.filter((idx) => idx > 0)
			.each((_, tr) => {
				const td = $(tr).find('td')
				const pokemon = pokemonMap.get(td.eq(0).text().trim())!
				pokemon.href = 'https://pokemondb.net' + td.eq(1).find('a').attr('href')!

				// pokemon.total = Number(td.eq(3).text().trim())
				// pokemon.hp = Number(td.eq(4).text().trim())
				// pokemon.atk = Number(td.eq(5).text().trim())
				// pokemon.def = Number(td.eq(6).text().trim())
				// pokemon.spAtk = Number(td.eq(7).text().trim())
				// pokemon.spDef = Number(td.eq(8).text().trim())
				// pokemon.speed = Number(td.eq(9).text().trim())
			})
	}

	private async getAbility(): Promise<Map<string, string>> {
		const abilityMap = new Map<string, string>()
		const $ = await fromURL('https://pokemondb.net/ability')
		$('tbody')
			.find('tr')
			.each((_, tr) => {
				const td = $(tr).find('td')
				abilityMap.set(td.eq(0).text().trim(), td.eq(2).text().trim())
			})

		return abilityMap
	}
}
