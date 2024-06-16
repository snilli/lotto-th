import { DrizzleService } from './drizzle.service'

import { DynamicModule, Global, Module } from '@nestjs/common'
import { GenDdTag, GenServiceTag } from './drizzle.decorator'
import { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } from './drizzle.definition'
import { DrizzleConfigOption } from './drizzle.interface'

@Global()
@Module({})
export class DrizzleModule extends ConfigurableModuleClass {
	static register(options: typeof OPTIONS_TYPE): DynamicModule {
		const { providers = [], exports = [], ...props } = super.register(options)
		const tag = options?.tag || 'default'
		return {
			...props,
			providers: [
				...providers,
				{
					provide: GenServiceTag(tag),
					useFactory: async () => {
						const drizzleService = new DrizzleService()
						await drizzleService.init(options)
						return drizzleService
					},
				},
				{
					provide: GenDdTag(tag),
					useFactory: async (drizzleService: DrizzleService) => {
						return drizzleService.getDrizzle()
					},
					inject: [GenServiceTag(tag)],
				},
			],
			exports: [...exports, GenDdTag(tag), GenServiceTag(tag)],
		}
	}
	static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
		const { providers = [], exports = [], ...props } = super.registerAsync(options)
		const tag = options?.tag || 'default'

		return {
			...props,
			providers: [
				...providers,
				{
					provide: GenServiceTag(tag),
					useFactory: async (config: DrizzleConfigOption) => {
						const drizzleService = new DrizzleService()
						await drizzleService.init(config)
						return drizzleService
					},
					inject: [MODULE_OPTIONS_TOKEN],
				},
				{
					provide: GenDdTag(tag),
					useFactory: async (drizzleService: DrizzleService) => {
						return drizzleService.getDrizzle()
					},
					inject: [GenServiceTag(tag)],
				},
			],
			exports: [...exports, GenDdTag(tag), GenServiceTag(tag)],
		}
	}
}
