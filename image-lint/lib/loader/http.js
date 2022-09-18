/* @flow */
import got from 'got';
import {Loader} from '../loader.js';

/**
 * Load files from HTTP.
 */
export class HttpLoader extends Loader {
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
