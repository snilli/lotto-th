import { nextui } from '@nextui-org/react'
import { dirname, join } from 'path'
import type { Config } from 'tailwindcss'

const ui = require('@snilli/ui/tailwind')

const config: Config = {
	presets: [ui],
	content: [
		...ui.content,
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
		'./src/app/**/*.{js,ts,jsx,tsx}',
		'./src/app/components/**/*.{js,ts,jsx,tsx}',
		join(dirname(require.resolve('@nextui-org/theme')), '**/*.{js,ts,jsx,tsx}'),
	],
	darkMode: 'class',
	theme: {
		extend: {},
	},
	plugins: [nextui()],
}

export default config
