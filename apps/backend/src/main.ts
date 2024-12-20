import { patchNestjsSwagger, ZodValidationPipe } from '@anatine/zod-nestjs'
import { INestApplication, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import compression from 'compression'
import { AppModule } from './app.module'
import { TransformInterceptor } from './transform.interceptor'

export function setupApp(app: INestApplication) {
	app.enableCors()
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1',
	})
	app.useGlobalPipes(new ZodValidationPipe())
	app.useGlobalInterceptors(new TransformInterceptor())
	app.use(compression())

	const config = new DocumentBuilder()
		.setTitle('lotto-th')
		.setDescription('Api for serve lotto in Thailand from pass to now')
		.setVersion('1.0')
		.addTag('lotto')
		.build()
	const documentFactory = () => SwaggerModule.createDocument(app, config)
	patchNestjsSwagger()
	SwaggerModule.setup('api', app, documentFactory)
	return app
}

export default async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	await setupApp(app).listen(8088)
}

bootstrap()

export const config = {
	runtime: 'nodejs',
	region: ['sin1'],
}
