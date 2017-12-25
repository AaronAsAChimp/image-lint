/* @flow */
'use strict';

const path = require('path'),
	  request = require('request'),
	  fs = require('fs'),
	  PixelFormat = require('./pixel-format').PixelFormat;

/*::
export
interface Dimensions {
	width: number;
	height: number;
	frames: number;
}
*/

class InfoProvider {
	/*::
	static _extension_registry: Map<string, InfoProvider>;
	static _mime_registry: Map<string, InfoProvider>;
	static _all_providers: InfoProvider[];
	static _all_extensions: string[];
	static _all_mimes: string[];

	magic: Buffer;
	*/

	validate_magic (buffer/*: Buffer */) {
		var buffer_magic = buffer.slice(0, this.magic.length);

		return Buffer.compare(this.magic, buffer_magic) === 0;
	}

	can_validate (buffer/*: Buffer */)/*: boolean */ {
		return buffer.length >= this.magic.length;
	}

	calculate_bpp (dims/*: Dimensions */, size/*: number */)/*: number */ {
		return (size - this.get_overhead()) / (dims.width * dims.height * dims.frames);
	}

	get_overhead () {
		return 0;
	}

	get_dimensions (buffer/*: Buffer */) {
		throw new Error('Not Implemented');
	}

	get_pixel_format (buffer/*: Buffer */)/*: PixelFormat */ {
		throw new Error('Not Implemented');
	}

	get_info (buffer/*: Buffer */) {
		let info = {
			'truncated': this.is_truncated(buffer),
		};

		if (!info.truncated) {
			let dims = this.get_dimensions(buffer);

			info.dimensions = dims;
			info.size = buffer.length;
			info.pixel_format = this.get_pixel_format(buffer);
			info.bytes_per_pixel = this.calculate_bpp(dims, buffer.length);
		}

		return info;
	}

	/**
	 * Is this provider only capable of identifying the file type or can it be
	 * used to get the full information.
	 *
	 * @return {Boolean} true if this provider is only for file identification.
	 */
	identify_only () {
		return false;
	}

	/**
	 * Is the file truncated.
	 * 
	 * @param  {Buffer}    A buffer containing a compressed image.
	 * @return {Boolean}   True if the file is invalid due to it being truncated.
	 */
	is_truncated (buffer/*: Buffer */)/*: boolean */ {
		throw new Error('Not Implemented');
	}

	/**
	 * Get the most common extension for this type of file.
	 *
	 * @return {String} containing the extension '.jpg', '.png', etc.
	 */
	get_extension () {
		return this.get_extensions()[0];
	}

	/**
	 * Get all the extensions for this type of file.
	 *
	 * @return {Array} a list of file extensions.
	 */
	get_extensions () {
		throw new Error('Not Implemented');
	}

	/**
	 * Get the most common mime for this type of file.
	 *
	 * @return {String} containing the mime type 'image/jpeg', 'image/png', etc.
	 */
	get_mime () {
		return this.get_mimes()[0];
	}

	/**
	 * Get all the mimes for this type of file.
	 *
	 * @return {Array} a list of mime types.
	 */
	get_mimes () {
		throw new Error('Not Implemented');
	}

	static load (providers) {
		for (let provider of providers) {
			require(provider);
		}
	}

	static register(Constructor) {
		let provider = new Constructor(),
			is_identify_only = provider.identify_only();

		for (let extension of provider.get_extensions()) {
			this._extension_registry.set(extension, provider);

			if (!is_identify_only) {
				this._all_extensions.push(extension);
			}
		}

		for (let mime of provider.get_mimes()) {
			this._mime_registry.set(mime, provider);

			if (!is_identify_only) {
				this._all_mimes.push(mime);
			}
		}

		this._all_providers.push(provider);
	}

	static get_info(file, logger, options) {
		return new Promise((resolve, reject) => {

			var extension = file.extension.toLowerCase(),
				provider = InfoProvider._extension_registry.get(extension),
				is_magic_valid = false;

			if (provider) {
				is_magic_valid = provider.validate_magic(file.buffer);
			} else {
				logger.warn('There is no information provider for "' + extension + '" files.');
			}

			// Attenpt to find the correct file type.
			if (!provider || !is_magic_valid) {
				logger.info('This file is not what it seems, attempting brute force discovery of file type.');

				provider = null;

				for (let candidate of InfoProvider._all_providers) {
					if (candidate.can_validate(file.buffer) && candidate.validate_magic(file.buffer)) {
						provider = candidate;
					}
				}
			}

			if (!is_magic_valid) {
				let found_extension = 'unknown';

				if (provider) {
					found_extension = provider.get_extension();
				}

				if (options.mismatch === true) {
					logger.warn('There is a mismatch between the file extension (' + extension + ') and the file contents (' + found_extension + ')');
				}
			}

			if (provider) {
				if (provider.identify_only()) {
					reject('Unsupported file type');
				} else {
					resolve(provider.get_info(file.buffer));
				}
			} else {
				reject('Unknown file type');
			}
		});
	}

	static get_all_extensions() {
		return InfoProvider._all_extensions;
	}

	static get_all_mimes() {
		return InfoProvider._all_mimes;
	}
}

InfoProvider._extension_registry = new Map();
InfoProvider._mime_registry = new Map();
InfoProvider._all_providers = [];
InfoProvider._all_extensions = [];
InfoProvider._all_mimes = [];

module.exports = InfoProvider;
