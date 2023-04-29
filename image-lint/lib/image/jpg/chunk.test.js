import {JPEGChunk} from './chunk';

test(`reading a SOI chunk from a JPEG file`, () => {
	// Arrange
	const image = Buffer.from('FFD8', 'hex');

	// Act
	const chunks = JPEGChunk.get_chunks(image, 0);

	// Assert
	expect(chunks[0].marker_code).toBe(0xFFD8);
});

test(`reading an APP0 chunk from a JPEG file`, () => {
	// Arrange
	const image = Buffer.from('FFE000104A46494600010101006000600000', 'hex');

	// Act
	const chunks = JPEGChunk.get_chunks(image, 0);

	// Assert
	expect(chunks[0].marker_code).toBe(0xFFE0);
	expect(chunks[0].length).toBe(16);
});


test(`reading an SOF chunk from a JPEG file`, () => {
	// Arrange
	const image = Buffer.from('FFC0001108017D023803012200021101031101', 'hex');

	// Act
	const chunks = JPEGChunk.get_chunks(image, 0);

	// Assert
	expect(chunks[0].marker_code).toBe(0xFFC0);
	expect(chunks[0].length).toBe(17);
	expect(chunks[0].is_sof_chunk()).toBe(true);
});

test(`reading an EOI chunk from a JPEG file`, () => {
	// Arrange
	const image = Buffer.from('FFD9', 'hex');

	// Act
	const chunks = JPEGChunk.get_chunks(image, 0);

	// Assert
	expect(chunks[0].marker_code).toBe(0xFFD9);
	expect(chunks[0].is_eoi_chunk()).toBe(true);
});

test(`reading an entropy coded segment`, () => {
	// Arrange
	const image = Buffer.from('FFD0AAFFD1', 'hex');

	// Act
	const chunks = JPEGChunk.get_chunks(image, 0);

	// Assert
	expect(chunks[0].offset).toBe(0);
	expect(chunks[0].marker_code).toBe(0xFFD0);

	expect(chunks[1].offset).toBe(2);
	expect(chunks[1].length).toBe(1);

	expect(chunks[2].offset).toBe(3);
	expect(chunks[2].marker_code).toBe(0xFFD1);

	expect(chunks.length).toBe(3);
});

test(`reading an entropy coded segment with escaped 0xFF values`, () => {
	// Arrange
	const image = Buffer.from('FFD0AAFF00AA', 'hex');

	// Act
	const chunks = JPEGChunk.get_chunks(image, 0);

	// Assert
	expect(chunks[0].offset).toBe(0);
	expect(chunks[0].marker_code).toBe(0xFFD0);

	expect(chunks[1].offset).toBe(2);
	expect(chunks[1].length).toBe(4);

	expect(chunks.length).toBe(2);
});
