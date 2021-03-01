/* @flow */
'use strict';

const InfoProvider = require('../image-info.js');
const RIFFInfoProvider = require('./riff-info.js');
const WEBP_TYPE_TAG = 0x57454250;

class WebPInfoProvider extends RIFFInfoProvider {
	constructor() {
		super();

		this.type_tag = WEBP_TYPE_TAG;
	}

	identify_only() {
		return true;
	}

	get_extensions() {
		return [
			'.webp'
		];
	}

	get_mimes() {
		return [
			'image/webp'
		];
	}
}

InfoProvider.register(WebPInfoProvider);
