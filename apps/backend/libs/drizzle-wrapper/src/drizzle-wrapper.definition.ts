import { ConfigurableModuleBuilder } from '@nestjs/common'
import { DrizzleWrapperConfig } from './drizzle-wrapper.interface'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
	new ConfigurableModuleBuilder<DrizzleWrapperConfig>()
		.setExtras(
			{
				tag: 'default',
			},
			(definition, extras) => ({
				...definition,
				tag: extras.tag,
			}),
		)
		.build()
