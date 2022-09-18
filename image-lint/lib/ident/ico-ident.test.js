/* @flow */

import {ImageIdentifier} from '../../lib/ident.js';

import './ico-ident.js';


test(`an ico identifier can identify an image`, () => {
	const ident = ImageIdentifier.from_extension('.ico');
	const image = Buffer.from('0000010001004040', 'hex');

	expect(ident).toBeDefined();

	if (ident) {
		expect(ident.can_validate(image)).toBe(true);
		expect(ident.is_of_file_type(image)).toBe(true);
	}
});

test(`an ico identifier can reject an invalid file`, () => {
	const ident = ImageIdentifier.from_extension('.ico');
	const image = Buffer.from('0000000000000000', 'hex');

	expect(ident).toBeDefined();

	if (ident) {
		expect(ident.is_of_file_type(image)).toBe(false);
	}
});

test(`an ico identifier can fail a truncated file`, () => {
	const ident = ImageIdentifier.from_extension('.ico');
	const image = Buffer.from('00', 'hex');

	expect(ident).toBeDefined();

	if (ident) {
		expect(ident.can_validate(image)).toBe(false);
	}
});
