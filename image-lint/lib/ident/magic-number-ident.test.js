/* @flow */

import {ImageIdentifier} from '../../lib/ident.js';
import {MagicNumberIdentifier} from './magic-number-ident.js';

/**
 * An image identifier that identifies GIF images.
 */
class FoobarIdentifier extends MagicNumberIdentifier {
	/**
	 * @inheritDoc
	 */
	get_magic() {
		return Buffer.from('5E1F1EDA7A', 'hex');
	}

	/**
	 * @inheritDoc
	 */
	get_extensions() {
		return [
			'.foo',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_mimes() {
		return [
			'image/x-foo-bar',
		];
	}
}

beforeEach(() => {
	ImageIdentifier.register(FoobarIdentifier);
});

afterEach(() => {
	ImageIdentifier.clear_registry();
});

test(`a magic number identifier can identify an image`, () => {
	const ident = ImageIdentifier.from_extension('.foo');
	const image = Buffer.from('5E1F1EDA7A', 'hex');

	expect(ident).toBeDefined();

	if (ident) {
		expect(ident.can_validate(image)).toBe(true);
		expect(ident.is_of_file_type(image)).toBe(true);
	}
});

test(`a magic number identifier can reject an invalid file`, () => {
	const ident = ImageIdentifier.from_extension('.foo');
	const image = Buffer.from('0000000000', 'hex');

	expect(ident).toBeDefined();

	if (ident) {
		expect(ident.is_of_file_type(image)).toBe(false);
	}
});

test(`a magic number identifier can fail a truncated file`, () => {
	const ident = ImageIdentifier.from_extension('.foo');
	const image = Buffer.from('5E1F1E', 'hex');

	expect(ident).toBeDefined();

	if (ident) {
		expect(ident.can_validate(image)).toBe(false);
	}
});
