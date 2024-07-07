import got from 'got';
import {Loader} from '../loader.js';

/**
 * Load files from HTTP.
 */
export class HttpLoader extends Loader {
	/**
	 * Load the file.
	 *
	 * @returns {Promise<Buffer>}  The loaded file.
	 */
	async load() {
		const response = await got(this.getPath(), {
			responseType: 'buffer',
		});

		return response.body;
	}
}
