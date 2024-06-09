import { Injectable } from '@nestjs/common'
import schema, { schemaType } from './schema'

@Injectable()
export class DrizzleSchemaService {
	getAllSchema() {
		return schema
	}

	getSchme(name: keyof schemaType) {
		return schema[name]
	}
}
