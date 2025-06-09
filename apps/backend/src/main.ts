import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import compression from 'compression'
import express from 'express'
import { AppModule } from './internal/app.module'
import { LottoModule } from './internal/lotto/lotto.module'

async function bootstrap(): Promise<void> {
	const expressApp = express()
	const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp))
	app.enableCors()
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1',
	})
	app.use(compression())

	const zodV4Document = SwaggerModule.createDocument(
		app,
		new DocumentBuilder()
			.setTitle('Example API')
			.setDescription('Example API description')
			.setVersion('1.0')
			.build(),
		{
			include: [LottoModule],
		},
	)
	SwaggerModule.setup('api', app, zodV4Document, {
		jsonDocumentUrl: 'swagger/json',
	})

	// const options = new DocumentBuilder()
	// 	.setTitle('lotto-th')
	// 	.setDescription('Api for serve lotto in Thailand from pass to now')
	// 	.setVersion('1.0')
	// 	.build()

	// const mainApiDocument = SwaggerModule.createDocument(app, options)
	// SwaggerModule.setup('api', app, mainApiDocument)
	await app.listen(8080)
}

// export const handler = async (event: any, context: Context, callback: Callback) => {
// 	const server = await bootstrap()
// 	void server(event, context, callback)
// }

if (process.env.NODE_ENV !== 'production') {
	void bootstrap()
}
