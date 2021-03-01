/* @flow */
'use strict';

const InfoProvider = require('../image-info.js');
const TIFF_TAG = 0x49492A00;

class TIFFInfoProvider extends InfoProvider {
	constructor() {
		super();

		this.magic = Buffer.from([0x49, 0x49, 0x2A, 0x00]);
	}

	identify_only() {
		return true;
	}

	get_extensions() {
		return [
			'.tif',
			'.tiff'
		];
	}

	get_mimes() {
		return [
			'image/tiff',
			'image/tiff-fx'
		];
	}
}

InfoProvider.register(TIFFInfoProvider);
