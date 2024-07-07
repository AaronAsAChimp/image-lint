import {JPEGChunk, EOI_MARKER} from './jpg/chunk.js';
import {InfoProvider} from '../image-info.js';
import {PixelFormat, ColorSpace} from '../pixel-format.js';

const HEIGHT_OFFSET = 5;
const WIDTH_OFFSET = 7;
const CHANNELS_OFFSET = 9;

// https://www.w3.org/Graphics/JPEG/jfif3.pdf
// https://www.w3.org/Graphics/JPEG/itu-t81.pdf
// http://www.itu.int/rec/T-REC-T.871-201105-I/en

/**
 * A JPEG info provider.
 */
export class JPGInfoProvider extends InfoProvider {
	/**
	 * @inheritdoc
	 */
	get_overhead() {
		// This is the size of the smallest possible JPG, I'm assuming it will
		// be mostly overhead.
		return 119;
	}

	/**
	 * @inheritdoc
	 */
	is_truncated(buffer) {
		return buffer.readUInt16BE(buffer.length - 2) !== EOI_MARKER;
	}

	/**
	 * @inheritdoc
	 */
	get_dimensions(buffer) {
		let width = null;
		let height = null;
		const chunks = JPEGChunk.get_chunks(buffer, 0);

		for (const chunk of chunks) {
			if (chunk.is_sof_chunk()) {
				// console.log('Reading header');

				width = buffer.readUInt16BE(chunk.offset + WIDTH_OFFSET);
				height = buffer.readUInt16BE(chunk.offset + HEIGHT_OFFSET);

				break;
			}
		}

		if (!width || !height) {
			throw new Error('Dimensions not found');
		}

		return {
			width: width,
			height: height,
			frames: 1,
		};
	}

	/**
	 * @inheritdoc
	 */
	get_pixel_format(buffer) {
		const format = new PixelFormat();
		let channels = null;
		const chunks = JPEGChunk.get_chunks(buffer, 0);

		for (const chunk of chunks) {
			if (chunk.is_sof_chunk()) {
				channels = buffer.readUInt8(chunk.offset + CHANNELS_OFFSET);

				break;
			}
		}

		if (channels === 1) {
			format.color_space = ColorSpace.G;
		} else if (channels === 3) {
			format.color_space = ColorSpace.RGB;
		} else if (channels === 4) {
			format.color_space = ColorSpace.CMYK;
		} else {
			format.color_space = ColorSpace.unkownFormat('Unknown', channels);
		}

		return format;
	}
}
