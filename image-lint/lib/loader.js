
/**
 * A base class for loader instances.
 */
export class Loader {
	/**
	 * Construct a new loader instance.
	 *
	 * @param  {string} path The path to use for loading files.
	 */
	constructor(path) {
		/** @type {string} */
		this._path = path;
	}

	/**
	 * The path.
	 *
	 * @returns {string} The path.
	 */
	getPath() {
		return this._path;
	}

	/**
	 * Load the file at the provided path.
	 *
	 * @returns {Promise<Buffer>}  An image file.
	 */
	load() {
		return Promise.reject(new Error('Not Implemented!'));
	}
}
