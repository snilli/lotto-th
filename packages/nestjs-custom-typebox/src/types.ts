import type { ParamData, PipeTransform, Type } from '@nestjs/common'
import { ApiOperationOptions } from '@nestjs/swagger'
import type { Static, StaticDecode, TComposite, TOmit, TPartial, TPick, TSchema } from '@sinclair/typebox'
import type { TypeCheck } from '@sinclair/typebox/compiler'

import { SchemaAnalysis } from './analyze-schema.js'
import { HttpStatusMessages, HttpSuccessfulStatusMessages } from './constants.js'

export type AllKeys<T> = T extends unknown ? Exclude<keyof T, symbol> : never

export type Obj<T = unknown> = Record<string, T>

export interface Configure {
	patchSwagger?: boolean
	setFormats?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any
export type MethodDecorator<T extends Function = any> = (
	target: object,
	propertyKey: string | symbol,
	descriptor: TypedPropertyDescriptor<T>,
) => TypedPropertyDescriptor<T> | void

export interface HttpEndpointDecoratorConfig<
	S extends TSchema = TSchema,
	RequestConfigs extends RequestValidatorConfig[] = RequestValidatorConfig[],
> extends Omit<ApiOperationOptions, 'requestBody' | 'parameters'> {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'
	responseCode?: number
	path?: string
	validate?: ValidatorConfig<S, RequestConfigs>
}

export interface SchemaValidator<T extends TSchema = TSchema> {
	schema: T
	name: string
	analysis: SchemaAnalysis
	check: TypeCheck<T>['Check']
	validate(data: Obj | Obj[]): unknown
}
export interface ValidatorConfigBase {
	schema?: TSchema
	coerceTypes?: boolean
	stripUnknownProps?: boolean
	name?: string
	required?: boolean
	pipes?: (PipeTransform | Type<PipeTransform>)[]
}

export interface DefaultResponseValidatorConfig<T extends TSchema = TSchema> extends ValidatorConfigBase {
	schema: T
	type?: 'default-response'
	httpMessage?: HttpSuccessfulStatusMessages
	description?: string
	example?: Static<T>
	required?: true
	pipes?: never
}

export interface ResponseValidatorConfig<T extends TSchema = TSchema> extends ValidatorConfigBase {
	schema?: T
	type?: 'response'
	httpMessage: HttpStatusMessages
	description?: string
	example?: Static<T>
	required?: true
	pipes?: never
}

export type BaseResponseValidatorConfig<T extends TSchema = TSchema> =
	| DefaultResponseValidatorConfig<T>
	| ResponseValidatorConfig<T>

export interface ParamValidatorConfig<T extends TSchema = TSchema> extends ValidatorConfigBase {
	schema?: T
	type: 'param'
	name: string
	stripUnknownProps?: never
}

export interface QueryValidatorConfig<T extends TSchema = TSchema> extends ValidatorConfigBase {
	schema?: T
	type: 'query'
	name: string
	stripUnknownProps?: never
}

export interface BodyValidatorConfig<T extends TSchema = TSchema> extends ValidatorConfigBase {
	schema: T
	type: 'body'
}

export interface ResponseSchema<T extends TSchema = TSchema> {
	schema?: T
	type: SchemaValidator
	description?: string
	example?: Static<T>
}

export type RequestValidatorConfig<T extends TSchema = TSchema> =
	| ParamValidatorConfig<T>
	| QueryValidatorConfig<T>
	| BodyValidatorConfig<T>

export type SchemaValidatorConfig = RequestValidatorConfig | ResponseValidatorConfig | DefaultResponseValidatorConfig

export type ValidatorType = NonNullable<SchemaValidatorConfig['type']>

export interface ValidatorConfig<S extends TSchema, RequestConfigs extends RequestValidatorConfig[]> {
	default?: DefaultResponseValidatorConfig<S>
	responses?: ResponseValidatorConfig<S>[]
	request?: [...RequestConfigs]
}

export type RequestConfigsToTypes<RequestConfigs extends RequestValidatorConfig[]> = {
	[K in keyof RequestConfigs]: RequestConfigs[K]['required'] extends false
		? RequestConfigs[K]['schema'] extends TSchema
			? StaticDecode<RequestConfigs[K]['schema']> | undefined
			: string | undefined
		: RequestConfigs[K]['schema'] extends TSchema
			? StaticDecode<RequestConfigs[K]['schema']>
			: string
}

export type TPartialSome<T extends TSchema, K extends PropertyKey[]> = TComposite<[TOmit<T, K>, TPartial<TPick<T, K>>]>

export type PipeTransformTypeBox = PipeTransform<Obj, unknown>
export type Metadata = Record<string, MetadataDetial>
export type MetadataDetial = {
	index: number
	data: ParamData
	pipes: (PipeTransformTypeBox | Type<PipeTransformTypeBox>)[]
}
