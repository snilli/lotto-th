import { Injectable } from '@nestjs/common'
import { createWriteStream, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { dirname, extname, join, resolve } from 'path'

@Injectable()
export class FsService {
	constructor(private path: string) {}
	setPath(path: string) {
		this.path = path
	}

	readFile(name: string) {
		return readFileSync(join(this.path, name), { encoding: 'utf-8' })
	}

	existFile(name: string) {
		return existsSync(join(this.path, name))
	}

	deleteFile(name: string) {
		rmSync(join(this.path, name))
	}

	writeFile(name: string, content: any) {
		const targetPath = join(this.path, name)
		if (this.existFile(name)) {
			this.deleteFile(name)
		}
		mkdirSync(resolve(dirname(targetPath)), {
			recursive: true,
		})

		const fileExt = extname(targetPath)
		if (fileExt === '.json') {
			writeFileSync(targetPath, Buffer.from(JSON.stringify(content)), {
				encoding: 'utf-8',
				flag: 'as',
			})
		} else if (['.jpg', '.png'].includes(fileExt)) {
			const buffer = Buffer.from(content)
			createWriteStream(targetPath).write(buffer)
		}
	}
}
