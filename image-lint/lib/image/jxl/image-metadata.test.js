const {SizeHeader, Ratio} = require('./size-header');
const {ImageMetadata} = require('./image-metadata');
const {BitStream} = require('./bit-stream.js');

test('read the header for a 1px x 1px image', () => {
	// Arrange
	const buffer = Buffer.from('001090505C08', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	const size_header = new SizeHeader(bit_stream); // Discard this.
	const image_metadata = new ImageMetadata(bit_stream);

	// console.log('bits read: ', bit_stream.get_bits_read());

	// Assert
	expect(size_header.get_small()).toBe(false);
	expect(size_header.get_ysize()).toBe(1);
	expect(size_header.get_xsize()).toBe(1);
	expect(size_header.get_ratio()).toBe(Ratio.XSIZE_IS_YSIZE);
});


test('read the header for a 2px x 4px image', () => {
	// Arrange
	const buffer = Buffer.from('1800028084E24200', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	const size_header = new SizeHeader(bit_stream); // Discard this.
	const image_metadata = new ImageMetadata(bit_stream);

	// console.log('bits read: ', bit_stream.get_bits_read());

	// Assert
	expect(size_header.get_small()).toBe(false);
	expect(size_header.get_ysize()).toBe(4);
	expect(size_header.get_xsize()).toBe(2);
	expect(size_header.get_ratio()).toBe(Ratio.XSIZE_SEPARATE);
});


test('read the header for a 512px x 512px image', () => {
	// Arrange
	const buffer = Buffer.from('F81FB013019815FB00', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	const size_header = new SizeHeader(bit_stream); // Discard this.
	const image_metadata = new ImageMetadata(bit_stream);

	// console.log('bits read: ', bit_stream.get_bits_read());

	// Assert
	expect(size_header.get_small()).toBe(false);
	expect(size_header.get_ysize()).toBe(512);
	expect(size_header.get_xsize()).toBe(512);
	expect(size_header.get_ratio()).toBe(Ratio.XSIZE_IS_YSIZE);
});
