export default () => ({
	port: parseInt(process.env.PORT!) || 3000,
	database: {
		host: process.env.NODE_ENV,
		port: parseInt(process.env.DATABASE_PORT!) || 5432,
	},
})
