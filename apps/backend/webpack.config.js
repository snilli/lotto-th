// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = (options) => {
	let config = { ...options }
	config.output.path = path.resolve(__dirname, 'api')
	return config
}
