import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	{
		ignores: ['node_modules', '**/node_modules/**', '**/*.js', '**/*.mjs', '**/*.d.ts'],
	},
	eslint.configs.recommended,
	tseslint.configs.recommendedTypeChecked,
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
			// '@typescript-eslint/no-explicit-any': 'off',
			// '@typescript-eslint/no-use-before-define': 'off',
			// '@typescript-eslint/no-unused-vars': 'off',
			// '@typescript-eslint/ban-types': 'off',
			// '@typescript-eslint/no-unsafe-return': 'off',
			// '@typescript-eslint/no-unsafe-member-access': 'off',
			// '@typescript-eslint/unbound-method': 'off',
			// '@typescript-eslint/no-unsafe-assignment': 'off',
			// '@typescript-eslint/no-unsafe-argument': 'off',
			// '@typescript-eslint/no-unsafe-call': 'off',
			// '@typescript-eslint/no-unsafe-function-type': 'off',
			// '@typescript-eslint/no-invalid-void-type': 'off',
		},
	},
)
