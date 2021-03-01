/* @flow */
'use strict';

const InfoProvider = require('../image-info.js');
const XMLInfoProvider = require('./xml-info.js');

class SVGInfoProvider extends XMLInfoProvider {
	constructor() {
		super();

		this.root_element = 'svg';
	}

	identify_only() {
		return true;
	}

	get_extensions() {
		return [
			'.svg'
		];
	}

	get_mimes() {
		return [
			'image/svg+xml'
		];
	}
}

InfoProvider.register(SVGInfoProvider);
