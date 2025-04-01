import serverlessExpress from '@codegenie/serverless-express'
import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Callback, Context, Handler } from 'aws-lambda'
import compression from 'compression'
import express from 'express'
import { configureNestJsTypebox } from 'nestjs-custom-typebox'
import { AppModule } from './app.module.js'

let cachedServer: Handler

configureNestJsTypebox({
	patchSwagger: true,
	setFormats: false,
})

async function bootstrap(): Promise<Handler> {
	if (!cachedServer) {
		const expressApp = express()
		const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp))
		app.enableCors()
		app.enableVersioning({
			type: VersioningType.URI,
			defaultVersion: '1',
		})
		app.use(compression())

		if (process.env.NODE_ENV !== 'production') {
			const options = new DocumentBuilder()
				.setTitle('lotto-th')
				.setDescription('Api for serve lotto in Thailand from pass to now')
				.setVersion('1.0')
				.build()

			const mainApiDocument = SwaggerModule.createDocument(app, options)
			SwaggerModule.setup('api', app, mainApiDocument)
			await app.listen(8080)
		}
		await app.init()

		cachedServer = serverlessExpress.configure({ app: expressApp })
	}

	return cachedServer
}

export const handler = async (event: any, context: Context, callback: Callback) => {
	const server = await bootstrap()
	void server(event, context, callback)
}

if (process.env.NODE_ENV !== 'production') {
	void bootstrap()
}
