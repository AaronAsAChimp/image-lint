import {U32} from './bit-stream.js';

/**
 * The JXL extra channel info header.
 */
export class ExtraChannelInfo {
	/** @type {number} */
	meaning;

	/** @type {number} */
	red;

	/** @type {number} */
	green;

	/** @type {number} */
	blue;

	/** @type {number} */
	solidity;

	/**
	 * Construct a new ExtraChannelInfo.
	 *
	 * @param  {import('./bit-stream.js').BitStream} stream The bit stream to read teh ExtraChannelInfo from.
	 */
	constructor(stream) {
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
