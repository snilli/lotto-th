import { Array, Literal, Object, Optional, Static, String, Type } from '@sinclair/typebox'

export const PrizeCheckGlobal = Object(
	{
		type: Literal('global'),
		numbers: Array(String({ maxLength: 6, minLength: 6 })),
	},
	{ additionalProperties: false },
)
export type PrizeCheckGlobal = Static<typeof PrizeCheckGlobal>

export const PrizeCheckLocalTypeDetail = Object(
	{
		exactly: Optional(Array(String({ minLength: 2, maxLength: 3 }))),
		ordering: Optional(Array(String({ minLength: 2, maxLength: 3 }))),
	},
	{
		additionalProperties: false,
	},
)
export type PrizeCheckLocalTypeDetail = Static<typeof PrizeCheckLocalTypeDetail>

export const PrizeCheckLocal = Object(
	{
		type: Literal('local'),
		'2digit-global': Optional(PrizeCheckLocalTypeDetail),
		'2digit-local': Optional(PrizeCheckLocalTypeDetail),
		'3digit-global': Optional(PrizeCheckLocalTypeDetail),
		'3digit-local': Optional(PrizeCheckLocalTypeDetail),
	},
	{
		additionalProperties: false,
	},
)
export type PrizeCheckLocal = Static<typeof PrizeCheckLocal>

export const PrizeCheck = Type.Union([PrizeCheckGlobal, PrizeCheckLocal])
export type PrizeCheck = Static<typeof PrizeCheck>
