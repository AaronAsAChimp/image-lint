/* @flow */

/*::
import InfoProvider from "./image-info.js";
*/

/**
 * Abstract class to identify the type of images.
 */
class ImageIdentifier {
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
	 * Add an image identifier to the registry.
	 * @param  {function} Constructor The constructor of the identifier.
	 */
	static register(Constructor/*: Class<ImageIdentifier> */) {
		const provider = new Constructor();
		const is_identify_only = provider.identify_only();

		for (const extension of provider.get_extensions()) {
			this._extension_registry.set(extension, provider);

			if (!is_identify_only) {
				this._all_extensions.push(extension);
			}
		}

		for (const mime of provider.get_mimes()) {
			this._mime_registry.set(mime, provider);

			if (!is_identify_only) {
				this._all_mimes.push(mime);
			}
		}

		this._all_providers.push(provider);
	}

	/**
	 * Clear the registered identifiers.
	 */
	static clear_registry() {
		this._extension_registry.clear();
		this._all_extensions.length = 0;

		this._mime_registry.clear();
		this._all_mimes.length = 0;

		this._all_providers.length = 0;
	}

	/**
	 * Get all of the know file extensions.
	 *
	 * @return {string[]} An array of file extension.
	 */
	static get_all_extensions()/*: string[] */ {
		return ImageIdentifier._all_extensions;
	}

	/**
	 * Get all of the known MIME types.
	 *
	 * @return {string[]} An array of MIME types.
	 */
	static get_all_mimes()/*: string[] */ {
		return ImageIdentifier._all_mimes;
	}

	/**
	 * Construct a new identifier using the file extension.
	 *
	 * @param {string} extension   The file extension of the.
	 * @return {ImageIdentifier}  The new image identifier.
	 */
	static from_extension(extension/*: string */)/*: ?ImageIdentifier */ {
		return ImageIdentifier._extension_registry.get(extension);
	}

	/**
	 * Iterate all of the registered providers.
	 */
	static* all_providers()/*: Generator<ImageIdentifier, void, void>*/ {
		yield* ImageIdentifier._all_providers;
	}
}

ImageIdentifier._extension_registry = new Map();
ImageIdentifier._mime_registry = new Map();
ImageIdentifier._all_providers = [];
ImageIdentifier._all_extensions = [];
ImageIdentifier._all_mimes = [];

module.exports = ImageIdentifier;
