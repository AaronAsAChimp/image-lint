/* @flow */
import fs from 'fs';
import {Loader} from '../loader.js';

/**
 * Load files from the file system.
 */
export class FsLoader extends Loader {
	/**
	 * Load the file.
	 * @return {Promise<Buffer>}  The loaded file.
	 */
	load()/*: Promise<Buffer> */ {
		return new Promise((resolve, reject) => {
			fs.readFile(this.getPath(), (err, buffer) => {
				if (err) {
					reject(err);
				}

				resolve(buffer);
			});
		});
	}
}
