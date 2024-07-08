import {Loader} from '../loader.js';

/**
 * Load files from a web browser Blob object.
 */
export class BlobLoader extends Loader {
	/**
	 * Construct a new BlobLoader.
	 *
	 * @param  {Blob} blob  A web browser Blob object
	 */
	constructor(blob) {
		super('');

		/** @type {Blob} */
		this._blob = blob;
	}

	/**
	 * Load the file.
	 *
	 * @returns {Promise<Buffer>}  The loaded file.
	 */
	async load() {
		const arrbuf = await this._blob.arrayBuffer();

		return Buffer.from(arrbuf);
	}
}
