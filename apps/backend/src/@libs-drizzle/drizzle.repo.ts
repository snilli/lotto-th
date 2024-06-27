import { type VercelPgDatabase } from 'drizzle-orm/vercel-postgres'

export abstract class DrizzleMainRepo<T extends Record<string, unknown>> {
	protected abstract readonly db: VercelPgDatabase<T>
	constructor() {}
}
