import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'
config({ path: '.env.development.local' })

export default defineConfig({
	dialect: 'postgresql',
	schema: ['./src/lotto/schema'],
	out: './drizzle',
	dbCredentials: {
		url: process.env.POSTGRES_URL,
	},
})
