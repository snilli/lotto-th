import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import { DrizzleModule } from '../@libs-drizzle/drizzle.module.js'
import { TimeModule } from '../@libs-time/time.module.js'

import { HttpExceptionFilter } from './common/filter/http-exception.filter.js'
import { LottoModule } from './lotto/lotto.module.js'
import { schema } from './lotto/infrastructure/postgres/schema/index.js'

@Module({
	imports: [
		// CacheModule.register({
		// 	ttl: 86400,
		// 	max: 100,
		// 	isGlobal: true,
		// }),
		ConfigModule.forRoot({
			envFilePath: ['.env.development.local', '.env.development'],
			isGlobal: true,
		}),
		DrizzleModule.registerAsync({
			tag: 'vercel',
			useFactory() {
				return {
					config: {
						schema: schema,
					},
				}
			},
		}),
		TimeModule,
		LottoModule,
	],
	providers: [
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ZodSerializerInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		// {
		// 	provide: APP_INTERCEPTOR,
		// 	useClass: CacheInterceptor,
		// },
	],
})
export class AppModule {}
