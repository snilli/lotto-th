export interface FsModuleOptions {
	path: string
	isCurrentDir: boolean
	source: 'local' | 's3'
}

export interface LocalFsModuleOptions {
	path: string
	isCurrentDir: boolean
	source: 'local'
}

export interface S3FsModuleOptions {
	path: string
	isCurrentDir: boolean
	source: 's3'
}
