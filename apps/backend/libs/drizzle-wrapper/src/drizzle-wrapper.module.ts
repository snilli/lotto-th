import { DrizzleWrapperService } from './drizzle-wrapper.service'

import { DynamicModule, Global } from '@nestjs/common'
import {
	ASYNC_OPTIONS_TYPE,
	ConfigurableModuleClass,
	MODULE_OPTIONS_TOKEN,
	OPTIONS_TYPE,
} from './drizzle-wrapper.definition'
import { DrizzleWrapperConfig } from './drizzle-wrapper.interface'

@Global()
export class DrizzleWrapperModule extends ConfigurableModuleClass {
	static register(options: typeof OPTIONS_TYPE): DynamicModule {
		const { providers = [], exports = [], ...props } = super.register(options)
		return {
			...props,
			providers: [
				...providers,
				DrizzleWrapperService,
				{
					provide: options?.tag || 'default',
					useFactory: async (drizzleService: DrizzleWrapperService) => {
						return await drizzleService.getDrizzle(options)
					},
					inject: [DrizzleWrapperService],
				},
			],
			exports: [...exports, options?.tag || 'default'],
		}
	}
	static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
		const { providers = [], exports = [], ...props } = super.registerAsync(options)
		return {
			...props,
			providers: [
				...providers,
				DrizzleWrapperService,
				{
					provide: options?.tag || 'default',
					useFactory: async (drizzleService: DrizzleWrapperService, config: DrizzleWrapperConfig) => {
						return await drizzleService.getDrizzle(config)
					},
					inject: [DrizzleWrapperService, MODULE_OPTIONS_TOKEN],
				},
			],
			exports: [...exports, options?.tag || 'default'],
		}
	}
}
