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
			.setTitle('lotto-th')
			.setDescription('Api for serve lotto in Thailand from pass to now')
			.setVersion('1.0')
			.build(),
		{
			include: [LottoModule],
		},
	)
	SwaggerModule.setup('api', app, zodV4Document, {
		jsonDocumentUrl: 'swagger/json',
	})

	await app.listen(8080)
}

void bootstrap()
