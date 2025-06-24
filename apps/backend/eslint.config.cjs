// @ts-nocheck
const eslint = require('@eslint/js')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const globals = require('globals')
const tseslint = require('typescript-eslint')

module.exports = tseslint.config(
	{
		ignores: [
			'dist',
			'node_modules',
			'**/node_modules/**',
			'**/*.mjs',
			'**/*.d.ts',
			'./src/lotto/schema/index.ts',
			'webpack.config.js',
			'**/eslint.config.*',
		],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	eslintPluginPrettierRecommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},
			ecmaVersion: 'latest',
			parserOptions: {
				project: ['tsconfig.json', 'tsconfig.spec.json'],
				projectService: true,
				tsconfigRootDir: __dirname,
			},
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-extraneous-class': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',

			'@typescript-eslint/typedef': 'error',
			// '@typescript-eslint/interface-name-prefix': 'error',
			'@typescript-eslint/no-unsafe-call': 'error',
			'@typescript-eslint/no-unsafe-member-access': 'error',
			'@typescript-eslint/no-unsafe-assignment': 'error',
			'@typescript-eslint/restrict-template-expressions': 'error',
			'@typescript-eslint/no-unsafe-return': 'error',
			'@typescript-eslint/no-require-imports': 'error',
		},
	},
)
