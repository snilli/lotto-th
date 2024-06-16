import { sql } from '@vercel/postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { VercelPgDatabase, drizzle } from 'drizzle-orm/vercel-postgres'
import { DrizzleConfigOption } from './drizzle.interface'

export class DrizzleService<T extends Record<string, unknown> = Record<string, unknown>> {
	private db!: VercelPgDatabase<T>
	init(options: DrizzleConfigOption): VercelPgDatabase<T> {
		this.db = drizzle(sql, options?.config)

		return this.db as VercelPgDatabase<T>
	}

	getDrizzle(): VercelPgDatabase<T> {
		return this.db as VercelPgDatabase<T>
	}

	migration(dir: string) {
		migrate(this.db, { migrationsFolder: dir })
	}
}
