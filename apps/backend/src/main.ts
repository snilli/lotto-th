import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

export default async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	await app.listen(8080)
}

bootstrap()

export const config = {
	runtime: 'nodejs',
	region: ['sin1'],
}
