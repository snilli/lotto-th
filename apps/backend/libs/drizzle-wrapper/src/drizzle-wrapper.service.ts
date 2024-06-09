import { Injectable } from '@nestjs/common'
import { sql } from '@vercel/postgres'
import { drizzle } from 'drizzle-orm/node-postgres'
import { DrizzleWrapperConfig } from './drizzle-wrapper.interface'

@Injectable()
export class DrizzleWrapperService {
	public async getDrizzle(options: DrizzleWrapperConfig) {
		return drizzle(sql, options?.config)
	}
}
