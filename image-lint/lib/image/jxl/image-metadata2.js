/* @flow */

/*::
import type {BitStream} from './bit-stream';
*/

import {U32} from './bit-stream.js';
import {ExtraChannelInfo} from './extra-channel-info.js';
import {Extensions} from './extensions.js';

/**
 * The JXL image metadata 2 header
 */
export class ImageMetadata2 {
	/*::
	have_preview: boolean;
	have_animation: boolean;
	orientation_minus_1: number;
	depth_bits: number;
	depth_shift: number;
	num_extra_channels: number;
	extra_channel_bits: number;
	extra_channel_info: ExtraChannelInfo[];
	extensions: Extensions | null;
	*/

	/**
	 * Construct a new ImageMetadata2.
	 *
	 * @param  {BitStream} stream The bit stream to read the ImageMetadata2 from.
	 */
	constructor(stream/*: BitStream */) {
		const all_default = stream.read_boolean();

		this.have_preview = false;
		this.have_animation = false;
		this.orientation_minus_1 = 0;
		this.depth_bits = 0;
		this.depth_shift = 0;
		this.num_extra_channels = 0;
		this.extra_channel_bits = 0;
		this.extra_channel_info = []; // TODO: implement
		this.extensions = null; // TODO: implement

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
