import { Module } from '@nestjs/common'
import { DrizzleSchemaService } from './drizzle-schema.service'

@Module({
	exports: [DrizzleSchemaService],
})
export class DrizzleSchemaModule {}
