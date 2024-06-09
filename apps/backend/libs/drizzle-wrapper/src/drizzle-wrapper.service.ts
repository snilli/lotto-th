import { Injectable } from '@nestjs/common'
import { sql } from '@vercel/postgres'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DrizzleWrapperConfig } from './drizzle-wrapper.interface'

@Injectable()
export class DrizzleWrapperService {
	public getDrizzle<T extends Record<string, unknown>>(options: DrizzleWrapperConfig): NodePgDatabase<T> {
		return drizzle(sql, options?.config)
	}
}
