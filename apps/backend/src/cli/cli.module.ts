import schema from '@app/schema'
import { Module } from '@nestjs/common'
import { DrizzleModule } from '../@libs-drizzle/drizzle.module'
import { MigrateCommand } from './service/cli.command'

@Module({
	imports: [
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
	],
	providers: [MigrateCommand],
})
export class CliModule {}
