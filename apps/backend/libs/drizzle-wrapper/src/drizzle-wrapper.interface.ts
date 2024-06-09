import { DrizzleConfig } from 'drizzle-orm'

export interface DrizzleWrapperConfig {
	config?: DrizzleConfig<any> | undefined
}
