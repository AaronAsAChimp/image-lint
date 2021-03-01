/* @flow */
'use strict';

const InfoProvider = require('../image-info.js');
const XMLInfoProvider = require('./xml-info.js');

class HTMLInfoProvider extends XMLInfoProvider {
	constructor() {
		super();

		this.root_element = 'html';
	}

	identify_only() {
		return true;
	}

	get_extensions() {
		return [
			'.html',
			'.htm',
			'.xhtml'
		];
	}

	get_mimes() {
		return [
			'text/html',
			'application/xhtml+xml'
		];
	}
}

InfoProvider.register(HTMLInfoProvider);
