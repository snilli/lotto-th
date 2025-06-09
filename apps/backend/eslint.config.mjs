import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	{
		ignores: [
			'node_modules',
			'**/node_modules/**',
			'**/*.js',
			'**/*.mjs',
			'**/*.d.ts',
			'./src/lotto/schema/index.ts',
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
			sourceType: 'module',
			parserOptions: {
				project: ['tsconfig.json', 'tsconfig.spec.json'],
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			// '@typescript-eslint/interface-name-prefix': 'off',
			// '@typescript-eslint/explicit-function-return-type': 'off',
			// '@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			// '@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@eslint@typescript-eslint/no-unsafe-assignment': 'off',
			// '@typescript-eslint/restrict-template-expressions': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			// '@typescript-eslint/no-extraneous-class': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-redundant-type-constituents': 'off',
			// '@typescript-eslint/no-require-imports': 'off',
			// '@typescript-eslint/no-unsafe-argument': 'off',
			// '@typescript-eslint/no-empty-function': 'off',
		},
	},
)
