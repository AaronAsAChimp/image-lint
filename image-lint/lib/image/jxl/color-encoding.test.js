import {SizeHeader} from './size-header.js';
import {ImageMetadata} from './image-metadata.js';
import {COLOR_SPACE} from './color-encoding.js';
import {BitStream} from './bit-stream.js';

test('read the header for a 1px x 1px image', () => {
	// Arrange
	//
	// Bits are read from the least significant end of the byte first.
	//
	// 00 | 00000000
	// 10 | 00010000
	// 90 | 10-0-1-0-00-0
	// 50 | 0101-0000
	// 5C | 01011100
	// 08 | 00001000
	//
	// small:boolean = 0
	// y_size:u32 = 00 000000000
	// ratio:u(3) = 001
	// ---
	// all_default:boolean = 0
	// have_icc:boolean = 0
	// bits_per_sample:u32 = 00 (val 8)
	// color_encoding:
	// 	- all_default: boolean = 0
	// 	- received_icc: boolean = 1
	// 	- opaque_icc: boolean = 0;
	// 	- color_space: enum = 10 0000
	// 	- ...

	const buffer = Buffer.from('001090505C08', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	new SizeHeader(bit_stream); // Discard this.
	const image_metadata = new ImageMetadata(bit_stream); // Discard some more bits.
	const color_encoding = image_metadata.color_encoding;

	// console.log('bits read: ', bit_stream.get_bits_read());

	// Assert
	expect(color_encoding.received_icc).toBe(true);
	expect(color_encoding.opaque_icc).toBe(false);
	expect(color_encoding.color_space).toBe(COLOR_SPACE.K_XYB);
});


test('read the header for a 2px x 4px image', () => {
	// Arrange
	//
	// Bits are read from the least significant end of the byte first.
	//
	// 18 | 00011000
	// 00 | 00000000
	// 02 | 00000010
	// 80 | 10000000
	// 84 | 10000100
	// E2 | 11100010
	// 42 | 01000010
	// 00 | 00000000
	//
	// small:boolean = 0
	// y_size:u32 = 00 000000011
	// ratio:u(3) = 000
	// x_size:u32 = 00 000000001
	// ---
	// all_default:boolean = 0
	// have_icc:boolean = 0
	// bits_per_sample:u32 = 00 (val 8)
	// color_encoding:
	// 	- all_default: boolean = 0
	// 	- received_icc: boolean = 1
	// 	- opaque_icc: boolean = 0;
	// 	- color_space: enum = 10 0000
	// 	- ...
	const buffer = Buffer.from('1800028084E24200', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	new SizeHeader(bit_stream); // Discard this.
	const image_metadata = new ImageMetadata(bit_stream); // Discard some more bits.
	const color_encoding = image_metadata.color_encoding;

	// console.log('bits read: ', bit_stream.get_bits_read());

	// Assert
	expect(color_encoding.received_icc).toBe(true);
	expect(color_encoding.opaque_icc).toBe(false);
	expect(color_encoding.color_space).toBe(COLOR_SPACE.K_XYB);
});


test('read the header for a 512px x 512px image', () => {
	// Arrange
	//
	// Bits are read from the least significant end of the byte first.
	//
	// F8 | 11111000
	// 1F | 00011111
	// B0 | 10000000
	// 13 | 00010011
	// 01 | 00000001
	// 98 | 10011000
	// 15 | 00010101
	// FB | 11111011
	// 00 | 00000000
	//
	// small:boolean = 0
	// y_size:u32 = 00 111111111
	// ratio:u(3) = 001
	// ---
	// all_default:boolean = 0
	// have_icc:boolean = 0
	// bits_per_sample:u32 = 00 (val 8)
	// color_encoding:
	// 	- all_default: boolean = 0
	// 	- received_icc: boolean = 0
	// 	- opaque_icc: boolean = 0;
	// 	- ...
	const buffer = Buffer.from('F81FB013019815FB00', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	new SizeHeader(bit_stream); // Discard this.
	const image_metadata = new ImageMetadata(bit_stream); // Discard some more bits.
	const color_encoding = image_metadata.color_encoding;

	// console.log('bits read: ', bit_stream.get_bits_read());

	// Assert
	expect(color_encoding.received_icc).toBe(true);
	expect(color_encoding.opaque_icc).toBe(true);
	expect(color_encoding.color_space).toBe(COLOR_SPACE.K_RGB);
});
