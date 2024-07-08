/**
 * Abstract class to identify the type of images.
 *
 * @abstract
 */
export class ImageIdentifier {
	/**
	 * Construct an ImageIdentifier
	 */
	constructor() {
		/** @type {import('./image-info.js').InfoProvider | null} */
		this._info_provider = null;
	}

	/**
	 * Determine if this file type is identify-only or if there is an associated
	 * information provider.
	 *
	 * @returns {boolean} True if the file type is identify-only.
	 */
	identify_only() {
		return !this.get_info_provider();
	}

	/**
	 * Determine if the file is of the file type.
	 *
	 * @abstract
	 * @param  {Buffer}  buffer The image buffer.
	 * @returns {boolean} True if the file is of the file type.
	 */
	is_of_file_type(buffer) {
		throw new Error('Not Implemented');
	}

	/**
	 * Get the most common extension for this type of file.
	 *
	 * @returns {string} containing the extension '.jpg', '.png', etc.
	 */
	get_extension() {
		return this.get_extensions()[0];
	}

	/**
	 * Get the possible file extensions for this type of file having the
	 * canonical extension as the first element.
	 *
	 * @abstract
	 * @returns {string[]} the file extensions
	 */
	get_extensions() {
		throw new Error('Not Implemented');
	}

	/**
	 * Get the most common mime for this type of file.
	 *
	 * @returns {string} containing the mime type 'image/jpeg', 'image/png', etc.
	 */
	get_mime() {
		return this.get_mimes()[0];
	}

	/**
	 * Get the possible MIME types for this type of file having the canonical
	 * MIME type as the first element.
	 *
	 * @abstract
	 * @returns {string[]} the MIME types.
	 */
	get_mimes() {
		throw new Error('Not Implemented');
	}

	/**
	 * Determine if the buffer contains enough information to be validated.
	 *
	 * @param  {Buffer} buffer The image buffer.
	 * @returns {boolean} True if the image can be validated.
	 */
	can_validate(buffer) {
		return false;
	}

	/**
	 * Get an instance of the info provider for this file type.
	 *
	 * @returns {typeof import('./image-info.js').InfoProvider | null} The info provider.
	 */
	get_info_provider() {
		return null;
	}

	/**
	 * Print debugging information for this type of file.
	 *
	 * @param  {Buffer} buffer       The image buffer.
	 * @param  {import('stream').Writable} write_stream Where to write the debugging
	 *                                        output to.
	 */
	debug_print(buffer, write_stream) {
		write_stream.write('There is no debugging information available.\n');
	}

	/**
	 * Get an instance of the linter for specialized linting for this type
	 * of file. Not all formats have additional linting.
	 *
	 * @param {Buffer} buffer The image bufer.
	 * @returns {import('./image-linter.js').ImageLinter} The linter.
	 */
	get_linter(buffer) {
		return null;
	}
}
