import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DrizzleModule } from './@libs-drizzle/drizzle.module.js'
import { TimeModule } from './@libs-time/time.module.js'
import { LottoModule } from './lotto/lotto.module.js'
import schema from './schema.js'

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
	// providers: [
	// 	{
	// 		provide: APP_INTERCEPTOR,
	// 		useClass: CacheInterceptor,
	// 	},
	// ],
})
export class AppModule {}
