import serverlessExpress from '@codegenie/serverless-express'
import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Context, Handler } from 'aws-lambda'
import compression from 'compression'
import express from 'express'
import { AppModule } from './app.module'
let cachedServer: Handler

async function bootstrap() {
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
				.setTitle('Cats example')
				.setDescription('The cats API description')
				.setVersion('1.0')
				.addTag('cats')
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

export const handler = async (event: any, context: Context, callback: any) => {
	const server = await bootstrap()
	return server(event, context, callback)
}

if (process.env.NODE_ENV !== 'production') {
	bootstrap()
}
