import fs from 'fs/promises';
import {Loader} from '../loader.js';

/**
 * Load files from the file system.
 */
export class FsLoader extends Loader {
	/**
	 * Load the file.
	 *
	 * @returns {Promise<Buffer>}  The loaded file.
	 */
	async load() {
		return await fs.readFile(this.getPath());
	}
}
