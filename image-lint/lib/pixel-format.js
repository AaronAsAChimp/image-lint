/**
 * An enumeration of all of the color spaces
 */
export class ColorSpace {
	/**
	 * Construct a new ColorSpace.
	 *
	 * @param  {string} name     The name of the color space.
	 * @param  {number} channels The number of channels for this color space.
	 */
	constructor(name, channels) {
		/** @type {string} */
		this.name = name;

		/** @type {number} */
		this.channels = channels;

		/** @type {string | null} */
		this.unk_format = null;

		ColorSpace.all_names.add(name);
	}

	/**
	 * If this is 'ColorSpace.UNK' return the name of the color format that
	 * was unknown.
	 *
	 * @returns {string} The unknown format.
	 */
	getUnkFormat() {
		return this.unk_format;
	}

	/**
	 * Get an existing color space with the given name.
	 *
	 * @param  {string} id   The name of the color space.
	 * @returns {ColorSpace | null}  The color space or null if no color space exists
	 *                       with that name.
	 */
	static from(id) {
		/** @type {ColorSpace | null} */
		let space = null;

		if (this.all_names.has(id)) {
			space = ColorSpace[id];
		}

		return space;
	}

	/**
	 * Construct a marker for an unknown color space.
	 *
	 * @param  {string} format      The name of the color space that was unknown.
	 * @param  {number} [channels]  The number of channels.
	 * @returns {ColorSpace}         The unknown color space.
	 */
	static unkownFormat(format, channels=-1) {
		const color_space = new ColorSpace('UNK', channels);

		color_space.unk_format = format;

		return color_space;
	}
}

ColorSpace.all_names = new Set();

ColorSpace.G = new ColorSpace('G', 1);
ColorSpace.RGB = new ColorSpace('RGB', 3);
ColorSpace.YCbCr = new ColorSpace('YCbCr', 3);
ColorSpace.YCCK = new ColorSpace('YCCK', 4);
ColorSpace.LAB = new ColorSpace('LAB', 3);
ColorSpace.HSV = new ColorSpace('HSV', 3);
ColorSpace.CMYK = new ColorSpace('CMYK', 4);
ColorSpace.XYZ = new ColorSpace('XYZ', 3);
ColorSpace.XYB = new ColorSpace('XYB', 3);

/**
 * The pixel format of an image.
 */
export class PixelFormat {
	/**
	 * Construct a new PixelFormat
	 */
	constructor() {
		/** @type {ColorSpace | null} */
		this.color_space = null;

		/** @type {boolean} */
		this.indexed = false;

		/** @type {boolean} */
		this.alpha = false;

		/** @type {Record<string, number>} */
		this.bit_depth = {};
	}
}
