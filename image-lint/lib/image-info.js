
/**
 * @typedef {object} Dimensions
 * @property {number} width  The width of the image
 * @property {number} height The height of the image
 * @property {number} frames The number of frames in the image
 */

/**
 * @typedef {object} ImageInfo
 * @property {boolean} truncated  True if the image file is truncated.
 * @property {Dimensions} [dimensions]  The dimensions of the image if available.
 * @property {number} [size]  The file size of the image.
 * @property {import('./pixel-format').PixelFormat} [pixel_format]  The format of the pixels.
 * @property {number} [bytes_per_pixel]  The number of bytes per pixel
 */

/**
 * Gather information about an image file.
 *
 * @abstract
 */
export class InfoProvider {
	/**
	 * Calculate the number of bytes per pixel in the image.
	 *
	 * @param  {Dimensions} dims The dimensions of the image.
	 * @param  {number} size     The file size of the image.
	 * @returns {number}          The number of bytes per pixel.
	 */
	calculate_bpp(dims, size) {
		return (size - this.get_overhead()) / (dims.width * dims.height * dims.frames);
	}

	/**
	 * Get the number of bytes of overhead of this file format.
	 *
	 * @returns {number} The number in bytes.
	 */
	get_overhead() {
		return 0;
	}

	/**
	 * Get the dimensions of the image.
	 *
	 * @abstract
	 * @param  {Buffer} buffer The file buffer.
	 * @returns {Dimensions} The dimensions of the image.
	 */
	get_dimensions(buffer) {
		throw new Error('Not Implemented');
	}

	/**
	 * Get the pixel format of the image.
	 *
	 * @abstract
	 * @param  {Buffer} buffer The file buffer.
	 * @returns {import('./pixel-format').PixelFormat} The pixel format of the image.
	 */
	get_pixel_format(buffer) {
		throw new Error('Not Implemented');
	}

	/**
	 * The the information for this file.
	 *
	 * @param  {Buffer} buffer The file buffer.
	 * @returns {ImageInfo}    This image information.
	 */
	get_info(buffer) {
		/** @type {ImageInfo} */
		const info = {
			'truncated': this.is_truncated(buffer),
		};

		if (!info.truncated) {
			const dims = this.get_dimensions(buffer);

			info.dimensions = dims;
			info.size = buffer.length;
			info.pixel_format = this.get_pixel_format(buffer);
			info.bytes_per_pixel = this.calculate_bpp(dims, buffer.length);
		}

		return info;
	}

	/**
	 * Is the file truncated.
	 *
	 * @abstract
	 * @param  {Buffer}    buffer A buffer containing a compressed image.
	 * @returns {boolean}  True if the file is invalid due to it being truncated.
	 */
	is_truncated(buffer) {
		throw new Error('Not Implemented');
	}
}
