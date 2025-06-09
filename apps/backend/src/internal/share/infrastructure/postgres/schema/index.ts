import * as lottoSchema from '../../../../lotto/infrastructure/postgres/schema/index'

export const schema = { ...lottoSchema }

export type schemaType = typeof schema

export default schema
