/* @flow */
const Loader = require('../loader');

/**
 * Load files from a web browser Blob object.
 */
class BlobLoader extends Loader {
	/*::
	_blob: Blob
	*/

	/**
	 * Construct a new BlobLoader.
	 *
	 * @param  {Blob} blob  A web browser Blob object
	 */
	constructor(blob/*: Blob */) {
		super('');

		this._blob = blob;
	}

	/**
	 * Load the file.
	 * @return {Promise<Buffer>}  The loaded file.
	 */
	async load()/*: Promise<Buffer> */ {
		const arrbuf = await this._blob.arrayBuffer();

		return Buffer.from(arrbuf);
	}
}

module.exports = BlobLoader;
