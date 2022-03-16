/* @flow */
'use strict';

/**
 * An enumeration of all of the color spaces
 */
class ColorSpace {
	/*::
	static G: ColorSpace;
	static RGB: ColorSpace;
	static YCbCr: ColorSpace;
	static YCCK: ColorSpace;
	static LAB: ColorSpace;
	static HSV: ColorSpace;
	static CMYK: ColorSpace;
	static XYZ: ColorSpace;
	static XYB: ColorSpace;

	static all_names: Set<string>;

	name: string;
	channels: number;

	*/

	/**
	 * Construct a new ColorSpace.
	 * @param  {string} name     The name of the color space.
	 * @param  {number} channels The number of channels for this color space.
	 */
	constructor(name/*: string */, channels/*: number */) {
		this.name = name;
		this.channels = channels;

		ColorSpace.all_names.add(name);
	}

	/**
	 * Get an existing color space with the given name.
	 * @param  {string} id   The name of the color space.
	 * @return {ColorSpace}  The color space or null if no color space exists
	 *                       with that name.
	 */
	static from(id/*: string*/)/*: ColorSpace | null */ {
		let space/*: ColorSpace | null */ = null;

		if (this.all_names.has(id)) {
			space = (ColorSpace/*: any */)[id];
		}

		return space;
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
class PixelFormat {
	/*::
	color_space: ColorSpace;
	indexed: boolean;
	alpha: boolean;
	bit_depth: { [channel: string]: number};
	*/

	/**
	 * Construct a new PixelFormat
	 */
	constructor() {
		this.indexed = false;
		this.alpha = false;
		this.bit_depth = {};
	}
}

module.exports = {
	'ColorSpace': ColorSpace,
	'PixelFormat': PixelFormat,
};
