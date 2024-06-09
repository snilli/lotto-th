import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { LottoModule } from './lotto/lotto.module'
@Module({
	imports: [
		CacheModule.register({
			ttl: 86400,
			max: 100,
			isGlobal: true,
		}),
		ConfigModule.forRoot({
			isGlobal: true,
		}),
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
