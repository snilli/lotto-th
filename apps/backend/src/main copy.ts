import { http } from '@google-cloud/functions-framework'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'
import express from 'express'
import { Express } from 'express-serve-static-core'
import { AppModule } from './app.module'

const server = express()

export const createNestServer = async (expressInstance: Express): Promise<NestExpressApplication> => {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(expressInstance))
	return app.init()
}

createNestServer(server)
	.then((app) => {
		app.listen(3000)
		console.log('Nest Ready')
	})
	.catch((err) => console.error('Nest broken', err))

http('lotto', server)

// export const api = functions.https.onRequest(server)
