import { Injectable } from '@nestjs/common'
import schemas from './schemas'

@Injectable()
export class DrizzleSchemaService {
	static getSchema() {
		return schemas
	}
}
