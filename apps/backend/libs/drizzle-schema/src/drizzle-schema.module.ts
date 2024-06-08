import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg'
import { Module } from '@nestjs/common'
import { DrizzleSchemaService } from './drizzle-schema.service'
import schemas from './schemas'

@Module({
	imports: [
		DrizzlePGModule.register({
			tag: 'DB_DEV',
			pg: {
				connection: 'client',
				config: {
					connectionString: 'postgres://postgres:@127.0.0.1:5432/drizzleDB',
				},
			},
			config: { schema: { ...schemas } },
		}),
	],
	providers: [DrizzleSchemaService],
	exports: [DrizzleSchemaService],
})
export class DrizzleSchemaModule {}
