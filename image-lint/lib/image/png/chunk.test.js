import {PNGChunk} from './chunk';

test(`reading an IHDR chunk from a PNG file`, () => {
	// Arrange
	const image = Buffer.from('0000000D4948445200000040000000400806000000AA6971DE', 'hex');

	// Act
	const chunks = PNGChunk.get_chunks(image, 0);

	// Assert
	expect(chunks[0].header).toBe(0x49484452);
	expect(chunks[0].verify()).toBe(true);
});

test(`reading an IEND chunk from a PNG file`, () => {
	// Arrange
	const image = Buffer.from('0000000049454E44AE426082', 'hex');

	// Act
	const chunks = PNGChunk.get_chunks(image, 0);

	// Assert
	expect(chunks[0].header).toBe(0x49454E44);
	expect(chunks[0].verify()).toBe(true);
});
