/* @flow */
const got = require('got'),
	  Loader = require('../loader');

/**
 * Load files from HTTP.
 */
class HttpLoader extends Loader {
	/**
	 * Load the file.
	 * @return {Promise<Buffer>}  The loaded file.
	 */
	async load()/*: Promise<Buffer> */ {
		const response = await got(this.getPath(), {
			responseType: 'buffer',
		});

		return response.body;
	}
}

module.exports = HttpLoader;
