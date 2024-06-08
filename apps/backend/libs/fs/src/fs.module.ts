import { DynamicModule, Module } from '@nestjs/common'
import { join } from 'path'
import { FsService } from './fs.service'
import { getFsToken } from './utils/fs-token'

@Module({})
export class FsModule {
	static forRoot(options: string[]): DynamicModule {
		const providers = options.map((o) => ({
			provide: getFsToken(o),
			useFactory: () => {
				return new FsService(join(process.cwd(), o))
			},
		}))

		return {
			global: true,
			module: FsModule,
			providers: providers,
			exports: providers,
		}
	}

	static forFeature(options: string[]): DynamicModule {
		const providers = options.map((o) => ({
			provide: getFsToken(o),
			useFactory: () => {
				return new FsService(join(process.cwd(), o))
			},
		}))

		return {
			module: FsModule,
			providers: providers,
			exports: providers,
		}
	}
}
