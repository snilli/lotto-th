import { Module } from '@nestjs/common'
import { DrizzleSchemaService } from './drizzle-schema.service'

@Module({
	providers: [DrizzleSchemaService],
	exports: [DrizzleSchemaService],
})
export class DrizzleSchemaModule {}
