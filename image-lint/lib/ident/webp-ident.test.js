/* @flow */

import {ImageIdentifier} from '../../lib/ident.js';

import './webp-ident.js';

test(`a webp identifier can identify an image`, () => {
	const ident = ImageIdentifier.from_extension('.webp');
	const image = Buffer.from('5249464696620000574542505650384C', 'hex');

	expect(ident).toBeDefined();

	if (ident) {
		expect(ident.can_validate(image)).toBe(true);
		expect(ident.is_of_file_type(image)).toBe(true);
	}
});

test(`a webp identifier can reject an invalid file`, () => {
	const ident = ImageIdentifier.from_extension('.webp');
	const image = Buffer.from('000000000000000000000000', 'hex');

	expect(ident).toBeDefined();

	if (ident) {
		expect(ident.is_of_file_type(image)).toBe(false);
	}
});

test(`a webp identifier can fail a truncated file`, () => {
	const ident = ImageIdentifier.from_extension('.webp');
	const image = Buffer.from('52494646', 'hex');

	expect(ident).toBeDefined();

	if (ident) {
		expect(ident.can_validate(image)).toBe(false);
	}
});
