'use strict';

const InfoProvider = require('../image-info.js');

const IHDR_OFFSET = 0xC;
const SECTION_HEADER_WIDTH = 4;

class PNGInfoProvider extends InfoProvider {

	constructor () {
		super();

		this.magic = new Buffer('89504e470d0a1a0a', 'hex');

	}

	get_overhead () {
		// This is the size of the smallest possible PNG, I'm assuming it will
		// be mostly overhead.
		return 67;
	}

	get_dimensions (buffer) {
		return {
			width: buffer.readUInt32BE(IHDR_OFFSET + SECTION_HEADER_WIDTH),
			height: buffer.readUInt32BE(IHDR_OFFSET + SECTION_HEADER_WIDTH + 4),
			frames: 1
		};
	}
	
	get_extensions() {
		return [
			'.png'
		];
	}

	get_mimes() {
		return [
			'image/png'
		];
	}
}

InfoProvider.register(PNGInfoProvider);
