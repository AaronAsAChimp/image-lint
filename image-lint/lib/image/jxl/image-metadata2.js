import {U32} from './bit-stream.js';
import {ExtraChannelInfo} from './extra-channel-info.js';
import {Extensions} from './extensions.js';

/**
 * The JXL image metadata 2 header
 */
export class ImageMetadata2 {
	/**
	 * Construct a new ImageMetadata2.
	 *
	 * @param  {import('./bit-stream.js').BitStream} stream The bit stream to read the ImageMetadata2 from.
	 */
	constructor(stream) {
		const all_default = stream.read_boolean();

		/** @type {boolean} */
		this.have_preview = false;

		/** @type {boolean} */
		this.have_animation = false;

		/** @type {number} */
		this.orientation_minus_1 = 0;

		/** @type {number} */
		this.depth_bits = 0;

		/** @type {number} */
		this.depth_shift = 0;

		/** @type {number} */
		this.num_extra_channels = 0;

		/** @type {number} */
		this.extra_channel_bits = 0;

		/** @type {ExtraChannelInfo[]} */
		this.extra_channel_info = [];

		/** @type {Extensions | null} */
		this.extensions = null;

		if (!all_default) {
			this.have_preview = stream.read_boolean();
			this.have_animation = stream.read_boolean();
			this.orientation_minus_1 = stream.read_bits(3);
			this.depth_bits = stream.read_u32(
				[U32.VAL, 0],
				[U32.VAL, 8],
				[U32.VAL, 16],
				[U32.BITS, 4],
			);
			this.depth_shift = stream.read_u32(
				[U32.VAL, 0],
				[U32.VAL, 3],
				[U32.VAL, 4],
				[U32.BITS_OFFSET, 3, 1],
			);
			this.num_extra_channels = stream.read_u32(
				[U32.VAL, 0],
				[U32.BITS, 4],
				[U32.BITS_OFFSET, 8, 16],
				[U32.BITS_OFFSET, 12, 1],
			);
			this.extra_channel_bits = stream.read_u32(
				[U32.VAL, 0],
				[U32.VAL, 8],
				[U32.VAL, 16],
				[U32.BITS, 4],
			);
		}

		if (this.num_extra_channels > 0) {
			for (let i = 0; i < this.num_extra_channels; i++) {
				this.extra_channel_info.push(new ExtraChannelInfo(stream));
			}
		}

		if (!all_default) {
			this.extensions = new Extensions(stream);
		}
	}
}
