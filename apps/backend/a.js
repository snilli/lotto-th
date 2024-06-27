await Bun.build({
	entrypoints: ['./src/main.ts'],
	outdir: './out',
	target: 'node',
	format: 'esm',
	minify: true,
	external: ['class-transformer', 'class-validator', '@nestjs/microservices', '@nestjs/websockets', 'drizzle-orm'],
	// external: ['*'],
})
