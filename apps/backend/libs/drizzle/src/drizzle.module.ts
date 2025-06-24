import { DrizzleService } from './drizzle.service'

import { DynamicModule, Global, Module } from '@nestjs/common'
import { GenServiceTag } from './drizzle.decorator'
import { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } from './drizzle.definition'
import { DrizzleConfigOption } from './drizzle.interface'

@Global()
@Module({})
export class DrizzleModule extends ConfigurableModuleClass {
	static register(options: typeof OPTIONS_TYPE): DynamicModule {
		const { providers = [], exports = [], ...props } = super.register(options)
		const tag = options.tag ?? 'default'
		return {
			...props,
			providers: [
				...providers,
				{
					provide: GenServiceTag(tag),
					useFactory: (): DrizzleService => {
						return new DrizzleService(options)
					},
				},
				// {
				// 	provide: GenDdTag(tag),
				// 	useFactory: async (drizzleService: DrizzleService) => {
				// 		return drizzleService.getDrizzle()
				// 	},
				// 	inject: [GenServiceTag(tag)],
				// },
			],
			exports: [
				...exports,
				GenServiceTag(tag),
				// ,GenDdTag(tag)
			],
		}
	}
	static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
		const { providers = [], exports = [], ...props } = super.registerAsync(options)
		const tag = options.tag ?? 'default'

		return {
			...props,
			providers: [
				...providers,
				{
					provide: GenServiceTag(tag),
					useFactory: (config: DrizzleConfigOption): DrizzleService => {
						return new DrizzleService(config)
					},
					inject: [MODULE_OPTIONS_TOKEN],
				},
				// {
				// 	provide: GenDdTag(tag),
				// 	useFactory: async (drizzleService: DrizzleService) => {
				// 		return drizzleService
				// 	},
				// 	inject: [GenServiceTag(tag)],
				// },
			],
			exports: [
				...exports,
				GenServiceTag(tag),
				// ,GenDdTag(tag)
			],
		}
	}
}
