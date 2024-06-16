import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DrizzleModule } from './@libs-drizzle/drizzle.module'
import { CliModule } from './cli/cli.module'
import schema from './schema'

@Module({
	imports: [
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
		CliModule,
	],
})
export class AppCliModule {}
