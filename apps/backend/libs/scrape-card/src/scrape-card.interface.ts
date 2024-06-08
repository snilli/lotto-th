export type DigimonLevel = 'R' | 'C' | 'U' | 'A'
export type Card = DigimonCard | OptionCard
export type DigimonType = 'Fire' | 'Ice' | 'Nature' | 'Darkness' | 'Rare'
export type OptionType = 'normal' | 'gem' | 'evolution'

export interface BaseCard {
	no: string
	name: string
	img: string
	support_effect: string
	synthesis_point: number
	synthesis_require: number
}

export interface DigimonCard extends BaseCard {
	level: DigimonLevel
	type: DigimonType
	hp: number
	dp_require: number
	active_effect: string
	dp: number
	circle: number
	triangle: number
	cross: number
}

export interface OptionCard extends BaseCard {
	level: 'O'
	type: 'Option'
	option_type: OptionType
}

export interface Synthesis {
	type: DigimonType | 'Option'
	name: string
	synthesis_point: number
	synthesis_require: number
}
