import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { DrizzleModule } from './@libs-drizzle/drizzle.module'
import { TimeModule } from './@libs-time/time.module'
import { LottoModule } from './lotto/lotto.module'
import schema from './schema'

@Module({
	imports: [
		CacheModule.register({
			ttl: 86400,
			max: 100,
			isGlobal: true,
		}),
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
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		},
	],
})
export class AppModule {}
