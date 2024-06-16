import { InjectServiceTag } from '@app/@libs-drizzle/drizzle.decorator'
import { DrizzleService } from '@app/@libs-drizzle/drizzle.service'
import { schemaType } from '@app/schema'
import { Command, CommandRunner, Option } from 'nest-commander'

interface MigrateCommandOptions {
	dir: string
}

@Command({
	name: 'migrate',
	description: 'A parameter parse',
})
export class MigrateCommand extends CommandRunner {
	constructor(@InjectServiceTag('vercel') private readonly drizzleService: DrizzleService<schemaType>) {
		super()
	}

	async run(_: string[], options: MigrateCommandOptions): Promise<void> {
		this.drizzleService.migration(options.dir)
	}

	@Option({
		flags: '-d, --dir <dir>',
		description: 'Dir for migrate script',
	})
	parseDir(val: string) {
		return val
	}
}
