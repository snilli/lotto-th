import { DrizzleConfig } from 'drizzle-orm'

export interface DrizzleConfigOption {
	config: DrizzleConfig<any> | undefined
}
