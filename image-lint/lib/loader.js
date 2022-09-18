/* @flow */

/**
 * A base class for loader instances.
 */
export class Loader {
	/*::
	_path: string;
	*/

	/**
	 * Construct a new loader instance.
	 *
	 * @param  {string} path The path to use for loading files.
	 */
	constructor(path/*: string */) {
		this._path = path;
	}

	/**
	 * The path.
	 * @return {string} The path.
	 */
	getPath()/*: string */ {
		return this._path;
	}

	/**
	 * Load the file at the provided path.
	 *
	 * @return {Promise<Buffer>}  An image file.
	 */
	load()/*: Promise<Buffer> */ {
		return Promise.reject('Not Implemented!');
	}
}
