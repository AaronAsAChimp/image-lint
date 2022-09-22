/* @flow */

/*::
import type {BitStream} from './bit-stream';
*/

import {U32} from './bit-stream.js';

/**
 * The JXL extra channel info header.
 */
export class ExtraChannelInfo {
	/*::
	meaning: number;
	red: number;
	green: number;
	blue: number;
	solidity: number;
	*/

	/**
	 * Construct a new ExtraChannelInfo.
	 *
	 * @param  {BitStream} stream The bit stream to read teh ExtraChannelInfo from.
	 */
	constructor(stream/*: BitStream */) {
		this.meaning = stream.read_u32(
			[U32.VAL, 0],
			[U32.VAL, 1],
			[U32.VAL, 2],
			[U32.BITS, 6],
		);

		this.red = 0;
		this.green = 0;
		this.blue = 0;
		this.solidity = 0;

		if (this.meaning === 1) {
			this.red = stream.read_f16();
			this.green = stream.read_f16();
			this.blue = stream.read_f16();
			this.solidity = stream.read_f16();
		}
	}
}
