import {SizeHeader, Ratio} from './size-header.js';
import {BitStream} from './bit-stream.js';

test('read the header for a 1px x 1px image', () => {
	// Arrange
	const buffer = Buffer.from('0010', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	const size_header = new SizeHeader(bit_stream);

	// console.log('bits read: ', bit_stream.get_bits_read());

	// Assert
	expect(size_header.get_small()).toBe(false);
	expect(size_header.get_ysize()).toBe(1);
	expect(size_header.get_xsize()).toBe(1);
	expect(size_header.get_ratio()).toBe(Ratio.XSIZE_IS_YSIZE);
});


test('read the header for a 2px x 4px image', () => {
	// Arrange
	const buffer = Buffer.from('18000280', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	const size_header = new SizeHeader(bit_stream);

	// console.log('bits read: ', bit_stream.get_bits_read());

	// Assert
	expect(size_header.get_small()).toBe(false);
	expect(size_header.get_ysize()).toBe(4);
	expect(size_header.get_xsize()).toBe(2);
	expect(size_header.get_ratio()).toBe(Ratio.XSIZE_SEPARATE);
});


test('read the header for a 512px x 512px image', () => {
	// Arrange
	const buffer = Buffer.from('F81F', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	const size_header = new SizeHeader(bit_stream);

	// console.log('bits read: ', bit_stream.get_bits_read());

	// Assert
	expect(size_header.get_small()).toBe(false);
	expect(size_header.get_ysize()).toBe(512);
	expect(size_header.get_xsize()).toBe(512);
	expect(size_header.get_ratio()).toBe(Ratio.XSIZE_IS_YSIZE);
});
