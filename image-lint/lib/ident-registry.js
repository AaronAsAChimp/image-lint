/**
 * @typedef {import('./ident.js').ImageIdentifier} ImageIdentifier
 */

import PNGIdent from './ident/png-ident.js';
import GIFIdent from './ident/gif-ident.js';
import JPGIdent from './ident/jpg-ident.js';
import JXLIdent from './ident/jxl-ident.js';
import AVIFIdent from './ident/avif-ident.js';

// Identify only
import BMPIdent from './ident/bmp-ident.js';
import PSDIdent from './ident/psd-ident.js';
import ICOIdent from './ident/ico-ident.js';
import TIFFIdent from './ident/tiff-ident.js';
import WEBPIdent from './ident/webp-ident.js';
import SVGIdent from './ident/svg-ident.js';
import HTMLIdent from './ident/html-ident.js';

/**
 * A registry for image identifiers.
 */
export class ImageIdentifierRegistry {
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
		return ImageIdentifierRegistry._all_extensions;
	}

	/**
	 * Get all of the known MIME types.
	 *
	 * @return {string[]} An array of MIME types.
	 */
	static get_all_mimes()/*: string[] */ {
		return ImageIdentifierRegistry._all_mimes;
	}

	/**
	 * Normalize the file extension by making sure its lower case and starts
	 * with a dot.
	 *
	 * @param  {string} ext The extension
	 * @return {string}     The extension but normalized.
	 */
	static normalize_extension(ext) {
		ext = ext.trim();

		if (ext[0] !== '.') {
			ext = '.' + ext;
		}

		// Get the canonical file extension for this type.
		const ident = ImageIdentifierRegistry.from_extension(ext);

		if (ident) {
			return ident.get_extension();
		}

		return null;
	}

	/**
	 * Construct a new identifier using the file extension.
	 *
	 * @param {string} extension   The file extension of the file.
	 * @return {ImageIdentifier}  The new image identifier.
	 */
	static from_extension(extension/*: string */)/*: ?ImageIdentifier */ {
		return ImageIdentifierRegistry._extension_registry.get(extension);
	}

	/**
	 * Construct a new identifier using the file descriptor. This doesn't load
	 * the file and only uses the metadata provided by the file
	 * descriptor.
	 *
	 * @param  {FileDescriptor} file The file descriptor.
	 * @return {ImageIdentifier}     The new image identifier.
	 */
	static from_file_descriptor(file) {
		return ImageIdentifierRegistry.from_extension(file.extension);
	}

	/**
	 * Iterate all of the registered providers.
	 */
	static* all_providers()/*: Generator<ImageIdentifier, void, void>*/ {
		yield* ImageIdentifierRegistry._all_providers;
	}
}

ImageIdentifierRegistry._extension_registry = new Map();
ImageIdentifierRegistry._mime_registry = new Map();
ImageIdentifierRegistry._all_providers = [];
ImageIdentifierRegistry._all_extensions = [];
ImageIdentifierRegistry._all_mimes = [];


ImageIdentifierRegistry.register(PNGIdent);
ImageIdentifierRegistry.register(GIFIdent);
ImageIdentifierRegistry.register(JPGIdent);
ImageIdentifierRegistry.register(JXLIdent);
ImageIdentifierRegistry.register(AVIFIdent);
ImageIdentifierRegistry.register(BMPIdent);
ImageIdentifierRegistry.register(PSDIdent);
ImageIdentifierRegistry.register(ICOIdent);
ImageIdentifierRegistry.register(TIFFIdent);
ImageIdentifierRegistry.register(WEBPIdent);
ImageIdentifierRegistry.register(SVGIdent);
ImageIdentifierRegistry.register(HTMLIdent);
