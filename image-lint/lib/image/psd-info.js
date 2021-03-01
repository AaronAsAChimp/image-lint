/* @flow */
'use strict';

const InfoProvider = require('../image-info.js');

class PSDInfoProvider extends InfoProvider {

	constructor () {
		super();

		this.magic = Buffer.from('38425053', 'hex');
	}

	identify_only () {
		return true;
	}

	get_extensions() {
		return [
			'.psd'
		];
	}

	get_mimes() {
		return [
			'image/photoshop',
			'image/x-photoshop',
			'image/psd'
		];
	}
}

InfoProvider.register(PSDInfoProvider);
