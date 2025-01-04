import serverlessExpress from '@codegenie/serverless-express'
import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Callback, Context, Handler } from 'aws-lambda'
import compression from 'compression'
import express from 'express'
import { configureNestJsTypebox } from 'nestjs-typebox'
import { AppModule } from './app.module'
import { TransformInterceptor } from './transform.interceptor'
let cachedServer: Handler

configureNestJsTypebox({
	patchSwagger: true,
	setFormats: true,
})

async function bootstrap() {
	if (!cachedServer) {
		const expressApp = express()
		const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp))
		app.enableCors()
		app.enableVersioning({
			type: VersioningType.URI,
			defaultVersion: '1',
		})
		app.useGlobalInterceptors(new TransformInterceptor())
		app.use(compression())

		if (process.env.NODE_ENV !== 'production') {
			const options = new DocumentBuilder()
				.setTitle('lotto-th')
				.setDescription('Api for serve lotto in Thailand from pass to now')
				.setVersion('1.0')
				.addTag('lotto')
				.build()

			const catDocument = SwaggerModule.createDocument(app, options)
			SwaggerModule.setup('api', app, catDocument)
			await app.listen(8080)
		}
		await app.init()
		cachedServer = serverlessExpress({ app: expressApp })
	}

	return cachedServer
}

export const handler = async (event: any, context: Context, callback: Callback) => {
	const server = await bootstrap()
	return server(event, context, callback)
}

if (process.env.NODE_ENV !== 'production') {
	bootstrap()
}
