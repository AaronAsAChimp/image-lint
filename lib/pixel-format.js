/* @flow */
'use strict';

class ColorSpace {
	/*::
	static G: ColorSpace;
	static RGB: ColorSpace;
	static YCbCr: ColorSpace;
	static YCCK: ColorSpace;
	static LAB: ColorSpace;
	static HSV: ColorSpace;
	static CMYK: ColorSpace;

	static all_names: Set<string>;

	name: string;
	channels: number;

	*/

	constructor (name/*: string */, channels/*: number */) {
		this.name = name;
		this.channels = channels;

		ColorSpace.all_names.add(name);
	}

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

class PixelFormat {
	/*::
	color_space: ColorSpace;
	indexed: boolean;
	alpha: boolean;
	bit_depth: { [channel: string]: number};
	*/

	constructor() {
		this.indexed = false;
		this.alpha = false;
		this.bit_depth = {};
	}
}

module.exports = {
	'ColorSpace': ColorSpace,
	'PixelFormat': PixelFormat
}