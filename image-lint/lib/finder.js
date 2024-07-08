
/**
 * @typedef {object} FileDescriptor
 * @property {string} path The path to the referenced file
 * @property {string} extension The extensions of the referenced file
 * @property {import('./loader').Loader} loader The loader that will load the file
 */

/**
 * A base class for finding files in different mediums.
 */
export class Finder {
	/**
	 * Construct a new Finder
	 *
	 * @param  {string[]} extensions The list of extensions to look for.
	 * @param  {string[]} mimes      The list of MIME types to look for.
	 */
	constructor(extensions, mimes) {
		/** @type {string[]} */
		this.extensions = extensions;

		/** @type {string[]} */
		this.mimes = mimes;
	}

	/**
	 * Get an iterator of unresolved file descriptors.
	 *
	 * @abstract
	 * @param {string[]} initial_items The items to search through.
	 * @returns {Promise<Generator<FileDescriptor, void, void>>}
	 *   The initial set of items to be searched for.
	 */
	get_files(initial_items) {
		throw new Error('Not Implemented');
	}

	/**
	 * Determine if the provided extension is an image extension (provided in
	 * the constructor).
	 *
	 * @param {string}  ext The extension to check.
	 * @returns {boolean}    True if it is an image extension, false otherwise.
	 */
	is_image_extension(ext) {
		return this.extensions.indexOf(ext) >= 0;
	}

	/**
	 * Determine if the provided MIME type is an image MIME type (provided in
	 * the constructor).
	 *
	 * @param {string}  mime The MIME type to check.
	 * @returns {boolean}     True if it is an image MIME type, false otherwise.
	 */
	is_image_mime(mime) {
		return this.mimes.indexOf(mime) >= 0;
	}
}
