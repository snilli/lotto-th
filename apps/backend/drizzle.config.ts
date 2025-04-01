import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'
config({ path: '.env.development.local' })

export default defineConfig({
	dialect: 'postgresql',
	schema: ['./dist/schema.js'],
	out: './drizzle',
	dbCredentials: {
		url: process.env.POSTGRES_URL,
	},
})
