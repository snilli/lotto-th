declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production'
			PORT?: string
			POSTGRES_DATABASE: string
			POSTGRES_HOST: string
			POSTGRES_PASSWORD: string
			POSTGRES_PRISMA_URL: string
			POSTGRES_URL: string
			POSTGRES_URL_NON_POOLING: string
			POSTGRES_URL_NO_SSL: string
			POSTGRES_USER: string
		}
	}
}

export {}
