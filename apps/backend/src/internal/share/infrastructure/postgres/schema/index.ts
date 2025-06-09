import * as lottoSchema from '../../../../lotto/infrastructure/postgres/schema/index.js'

export const schema = { ...lottoSchema }

export type schemaType = typeof schema

export default schema
