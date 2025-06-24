import { OnModuleInit } from '@nestjs/common'
import { sql } from '@vercel/postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { VercelPgDatabase, drizzle } from 'drizzle-orm/vercel-postgres'
import { DrizzleConfigOption } from './drizzle.interface'

type DrizzleFn<T extends Record<string, unknown>> = typeof drizzle<T>
const Drizzle = drizzle as unknown as new <T extends Record<string, unknown>>(
	...args: Parameters<DrizzleFn<T>>
) => VercelPgDatabase<T>

export class DrizzleService<T extends Record<string, unknown> = Record<string, unknown>>
	extends Drizzle<T>
	implements OnModuleInit
{
	constructor(options: DrizzleConfigOption) {
		super(sql, options.config ?? {})
	}

	async onModuleInit(): Promise<void> {
		await migrate(this, {
			migrationsFolder: './drizzle',
		})
	}

	async migration(dir: string): Promise<void> {
		await migrate(this, { migrationsFolder: dir })
	}
}
