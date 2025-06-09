declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production'
			PORT: string
			POSTGRES_URL: string
			POSTGRES_PORT: string
		}
	}
}

export {}
