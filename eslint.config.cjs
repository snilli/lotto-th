const turbo = require('eslint-plugin-turbo')

module.exports = [
	{
		plugins: {
			turbo,
		},
		rules: {
			'turbo/no-undeclared-env-vars': [
				'error',
				{
					allowList: ['^ENV_[A-Z]+$'],
				},
			],
		},
	},
]
