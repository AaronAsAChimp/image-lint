/* @flow */

/**
 * @typedef {import('stream').Writable} Writable
 */

/*::
import {InfoProvider} from "./image-info.js";
*/

/**
 * Abstract class to identify the type of images.
 */
export class ImageIdentifier {
	/*::
	_info_provider: InfoProvider | null

	static _extension_registry: Map<string, ImageIdentifier>;
	static _mime_registry: Map<string, ImageIdentifier>;
	static _image_extensions: string[];
	static _all_extensions: string[];
	static _all_mimes: string[];
	static _all_providers: ImageIdentifier[];
	*/

	/**
	 * Construct an InfoProvider
	 */
	constructor() {
		this._info_provider = null;
	}

	/**
	 * Determine if this file type is identify-only or if there is an associated
	 * information provider.
	 *
	 * @return {boolean} True if the file type is identify-only.
	 */
	identify_only()/*: boolean */ {
		return !this.get_info_provider();
	}

	/**
	 * Determine if the file is of the file type.
	 *
	 * @abstract
	 * @param  {Buffer}  buffer The image buffer.
	 */
	is_of_file_type(buffer/*: Buffer */)/*: boolean */ {
		throw new Error('Not Implemented');
	}

	/**
	 * Get the most common extension for this type of file.
	 *
	 * @return {String} containing the extension '.jpg', '.png', etc.
	 */
	get_extension()/*: string */ {
		return this.get_extensions()[0];
	}

	/**
	 * Get the possible file extensions for this type of file having the
	 * canonical extension as the first element.
	 */
	get_extensions()/*: string[] */ {
		throw new Error('Not Implemented');
	}

	/**
	 * Get the most common mime for this type of file.
	 *
	 * @return {String} containing the mime type 'image/jpeg', 'image/png', etc.
	 */
	get_mime()/*: string */ {
		return this.get_mimes()[0];
	}

	/**
	 * Get the possible MIME types for this type of file having the canonical
	 * MIME type as the first element.
	 */
	get_mimes()/*: string[] */ {
		throw new Error('Not Implemented');
	}

	/**
	 * Determine if the buffer contains enough information to be validated.
	 *
	 * @param  {Buffer} buffer The image buffer.
	 * @return {boolean} True if the image can be validated.
	 */
	can_validate(buffer/*: Buffer */)/*: boolean */ {
		return false;
	}

	/**
	 * Get an instance of the info provider for this file type.
	 *
	 * @return {InfoProvider} The info provider.
	 */
	get_info_provider()/*: Class<InfoProvider> | null */ {
		return null;
	}

	/**
	 * Print debugging information for this type of file.
	 * @param  {Buffer} buffer       The image buffer.
	 * @param  {Writable} write_stream Where to write the debugging
	 *                                        output to.
	 */
	debug_print(buffer, write_stream) {
		write_stream.write('There is no debugging information available.\n');
	}

	/**
	 * Get an instance of the linter for specialized linting for this type
	 * of file. Not all formats have additional linting.
	 * @param {Buffer} buffer The image bufer.
	 * @return {ImageLinter} The linter.
	 */
	get_linter(buffer) {
		return null;
	}
}
