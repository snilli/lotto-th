import { ConfigurableModuleBuilder } from '@nestjs/common'
import { DrizzleConfigOption } from './drizzle.interface'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
	new ConfigurableModuleBuilder<DrizzleConfigOption>()
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
