/* @flow */
'use strict';

const InfoProvider = require('../image-info.js');

// https://en.wikipedia.org/wiki/BMP_file_format

class BMPInfoProvider extends InfoProvider {

	constructor () {
		super();

		this.magic = new Buffer('424D', 'hex');
	}

	identify_only () {
		return true;
	}
	
	get_extensions() {
		return [
			'.bmp'
		];
	}

	get_mimes() {
		return [
			'image/bmp',
			'image/x-bmp'
		];
	}
}

InfoProvider.register(BMPInfoProvider);
