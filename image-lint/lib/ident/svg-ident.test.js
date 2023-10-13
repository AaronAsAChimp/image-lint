/* @flow */

import {ImageIdentifierRegistry} from '../../lib/ident-registry.js';

import './svg-ident.js';

test(`a SVG identifier can identify an image`, () => {
	const ident = ImageIdentifierRegistry.from_extension('.svg');
	const image = Buffer.from('<?xml version="1.0" encoding="UTF-8" ?><svg></svg>', 'utf8');

	expect(ident).toBeDefined();

	if (ident) {
		expect(ident.can_validate(image)).toBe(true);
		expect(ident.is_of_file_type(image)).toBe(true);
	}
});

test(`a SVG identifier can reject an invalid file`, () => {
	const ident = ImageIdentifierRegistry.from_extension('.svg');
	const image = Buffer.from('<!doctype html><html></html>', 'hex');

	expect(ident).toBeDefined();

	if (ident) {
		expect(ident.is_of_file_type(image)).toBe(false);
	}
});
