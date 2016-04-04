'use strict';

const InfoProvider = require('../image-info.js');

const MARKER_LENGTH = 2;
const CHUNKS_WITH_DIMS = 0xF0;
const HEIGHT_OFFSET = 5;
const WIDTH_OFFSET = 7;

class JPGInfoProvider extends InfoProvider {

	constructor () {
		super();

		this.magic = new Buffer('ffd8ff', 'hex');

	}

	/**
	 * @return Number the offset of the next chunk
	 */
	next_chunk (buffer, offset) {
		return offset + MARKER_LENGTH + buffer.readUInt16BE(offset + 2); //this.calculate_chunk_length(s1, s2);
	}

	get_overhead () {
		// This is the size of the smallest possible JPG, I'm assuming it will
		// be mostly overhead.
		return 119;
	}

	get_dimensions (buffer) {
		// Skip the first two bytes
		var offset = this.next_chunk(buffer, MARKER_LENGTH),
			width = null,
			height = null,
			found = false;

		while (!found) {
			//console.log((buffer.readUInt8(offset)).toString(16));
			//console.log((buffer.readUInt8(offset + 1)).toString(16));
			let sof_byte = buffer.readUInt8(offset + 1);

			if ((sof_byte & CHUNKS_WITH_DIMS) === 0xC0 && sof_byte !== 0xC4 && sof_byte !== 0xC8 && sof_byte !== 0xCC) {
				found = true;
				//console.log('Reading header');

				width = buffer.readUInt16BE(offset + WIDTH_OFFSET);
				height = buffer.readUInt16BE(offset + HEIGHT_OFFSET);
			}

			offset = this.next_chunk(buffer, offset);

			//console.log(offset, buffer.length);

			if (offset > buffer.length) {
				found = true;
			}
		}

		if (!width || !height) {
			throw new Error('Dimensions not found');
		}

		return {
			width: width,
			height: height,
			frames: 1
		};
	}

	get_extensions() {
		return [
			'.jpg',
			'.jpeg',
			'.jpe'
		];
	}

	get_mimes() {
		return [
			'image/jpeg'
		];
	}
}

InfoProvider.register(JPGInfoProvider);
