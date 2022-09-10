/* @flow */
'use strict';

/*::
import type {Dimensions} from '../image-info.js';
*/

const InfoProvider = require('../image-info.js');
const pf = require('../pixel-format');
const {RootBlock} = require('../image/isobmff/isobmff.js');

const PixelFormat = pf.PixelFormat;
const ColorSpace = pf.ColorSpace;

/**
 * A AVIF info provider.
 */
class AVIFInfoProvider extends InfoProvider {
	/**
	 * @inheritdoc
	 */
	get_overhead()/*: number */ {
		// This is the size of the smallest possible AVIF, I'm assuming it will
		// be mostly overhead.
		return 333;
	}

	/**
	 * @inheritdoc
	 */
	is_truncated(buffer/*: Buffer */)/*: boolean */ {
		// TODO: implement
		return false;
	}

	/**
	 * @inheritdoc
	 */
	get_dimensions(buffer/*: Buffer */)/*: Dimensions */ {
		const root = new RootBlock(buffer);
		const ispeAtom = root.children.meta.children.iprp.children.ipco.children.ispe;

		return {
			width: ispeAtom.width,
			height: ispeAtom.height,
			frames: 1,
		};
	}

	/**
	 * @inheritdoc
	 */
	get_pixel_format(buffer/*: Buffer */)/*: PixelFormat */ {
		const root = new RootBlock(buffer);
		const format = new PixelFormat();
		format.color_space = ColorSpace.RGB;
		const pixi = root.children.meta.children.iprp.children.ipco.children.pixi;

		// console.log(root.children.meta.children.iprp.children.ipco.children);

		if (pixi) {
			const channels = pixi.channels;

			if (channels === 1) {
				format.color_space = ColorSpace.G;
			} else if (channels === 3) {
				format.color_space = ColorSpace.RGB;
			} else {
				format.color_space = ColorSpace.unkownFormat('Unknown', channels);
			}
		} else {
			// If there is no 'pixi' atom assume RGB. I don't know if this is
			// the correct way of handling this.
			format.color_space = ColorSpace.RGB;
		}

		return format;
	}
}

module.exports = AVIFInfoProvider;
