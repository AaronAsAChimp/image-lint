/* @flow */
/*::
import {test, expect} from 'jest';
*/
import {U32, BitStream, IllformedStreamError} from './bit-stream.js';

test('read individual bits from a bit stream', () => {
	// Arrange
	// Hex:          0xAA
	// Binary: 0b10101010
	const buffer = Buffer.from('AA000000', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	const bit1 = bit_stream.read_bits(1);
	const bit2 = bit_stream.read_bits(1);
	const bit3 = bit_stream.read_bits(1);
	const bit4 = bit_stream.read_bits(1);
	const bit5 = bit_stream.read_bits(1);
	const bit6 = bit_stream.read_bits(1);
	const bit7 = bit_stream.read_bits(1);
	const bit8 = bit_stream.read_bits(1);

	// Assert
	expect(bit1).toBe(0);
	expect(bit2).toBe(1);
	expect(bit3).toBe(0);
	expect(bit4).toBe(1);
	expect(bit5).toBe(0);
	expect(bit6).toBe(1);
	expect(bit7).toBe(0);
	expect(bit8).toBe(1);
});

test('read two bits from a bit stream', () => {
	// Arrange
	// Hex:          0xAA
	// Binary: 0b10101010
	const buffer = Buffer.from('AA', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	const bit2 = bit_stream.read_bits(2);
	const bit4 = bit_stream.read_bits(2);
	const bit6 = bit_stream.read_bits(2);
	const bit8 = bit_stream.read_bits(2);

	// Assert
	expect(bit2).toBe(0b10);
	expect(bit4).toBe(0b10);
	expect(bit6).toBe(0b10);
	expect(bit8).toBe(0b10);
});

test('read three bits from a bit stream', () => {
	// Arrange
	// Hex:          0xAA
	// Binary: 0b10101010
	const buffer = Buffer.from('AA', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	const bit4 = bit_stream.read_bits(3);
	const bit6 = bit_stream.read_bits(3);
	const bit8 = bit_stream.read_bits(2);

	// Assert
	expect(bit4).toBe(0b010);
	expect(bit6).toBe(0b101);
	expect(bit8).toBe(0b10);
});

test('read seven bits from a bit stream', () => {
	// Arrange
	// Hex:                0xFFAA
	// Binary: 0b1 1111111 10 101010
	// Label:    b aaaaaaa cc bbbbbb
	const buffer = Buffer.from('FFAA', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	const bitsa = bit_stream.read_bits(7);
	const bitsb = bit_stream.read_bits(7);
	const bitsc = bit_stream.read_bits(2);

	// Assert
	expect(bitsa).toBe(0b1111111);
	expect(bitsb).toBe(0b1010101);
	expect(bitsc).toBe(0b10);
});

test('read thirty bits from a bit stream', () => {
	// Arrange
	// (Big Endian)                       0xE0100801
	// Hex:                               0x010810E0
	// Binary: 0b00000001 00001000 00010000 11100000
	const buffer = Buffer.from('010810E0', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	const bitsa = bit_stream.read_bits(30);
	const bitsb = bit_stream.read_bits(2);

	// Assert
	expect(bitsa).toBe(0b100000000100000000100000000001);
	expect(bitsb).toBe(0b11);
});

test('read 7-10-7 bits from a bit stream', () => {
	// Arrange
	// (Big Endian)                0x7EFFBF
	// Hex:                        0xBFFF7E
	// Binary: 0b10111111 11111111 01111110
	const buffer = Buffer.from('BFFF7E', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	const bitsa = bit_stream.read_bits(7);
	const bitsb = bit_stream.read_bits(10);
	const bitsc = bit_stream.read_bits(7);

	// Assert
	expect(bitsa).toBe(0b0111111);
	expect(bitsb).toBe(0b0111111111);
	expect(bitsc).toBe(0b0111111);
});

test('read a U32 "Val" from a bit stream (example 1 from specification)', () => {
	// Arrange
	// Hex:          0x80
	// Binary: 0b10000000
	const buffer = Buffer.from('02', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	const value = bit_stream.read_u32(
		[U32.VAL, 8],
		[U32.VAL, 16],
		[U32.VAL, 32],
		[U32.BITS, 6],
	);

	// Assert
	expect(value).toBe(32);
});

test('read a U32 "Bits" from a bit stream (example 2 from specification)', () => {
	// Arrange
	// Hex:          0x1D
	// Binary: 0b00011101  (The spec gives the input of "010111" but that appears to be an error.)

	const buffer = Buffer.from('1D', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	const value = bit_stream.read_u32(
		[U32.BITS, 2],
		[U32.BITS, 4],
		[U32.BITS, 6],
		[U32.BITS, 8],
	);

	// Assert
	expect(value).toBe(7);
});


test('read a U32 "Bits Offset" from a bit stream', () => {
	// Arrange
	// Hex:                0xFFC0
	// Binary: 0b11111111 00000011
	const buffer = Buffer.from('FF03', 'hex');
	const bit_stream = new BitStream(buffer, 0);

	// Act
	const value = bit_stream.read_u32(
		[U32.VAL, 8],
		[U32.VAL, 16],
		[U32.VAL, 32],
		[U32.BITS_OFFSET, 8, 49],
	);

	// Assert
	expect(value).toBe(304);
});

test('read an enumeration', () => {
	// Arrange
	const buffer = Buffer.from('A46E00', 'hex');
	const bit_stream = new BitStream(buffer, 0);
	const enum_table = new Set();

	enum_table.add(0);
	enum_table.add(1);
	enum_table.add(12);
	enum_table.add(24);

	// Act
	const val1 = bit_stream.read_enum(enum_table);
	const val2 = bit_stream.read_enum(enum_table);
	const val3 = bit_stream.read_enum(enum_table);
	const val4 = bit_stream.read_enum(enum_table);

	// Assert
	expect(val1).toBe(0);
	expect(val2).toBe(1);
	expect(val3).toBe(12);
	expect(val4).toBe(24);
});

test('read_enum should throw on values > 63', () => {
	// Arrange
	const buffer = Buffer.from('BB00', 'hex');
	const bit_stream = new BitStream(buffer, 0);
	const enum_table = new Set();

	enum_table.add(64);

	// Act
	const act = () => {
		bit_stream.read_enum(enum_table);
	};

	// Assert
	expect(act).toThrow(new IllformedStreamError('Enum: Invalid value: 64'));
});

test('read_enum should throw on missing values', () => {
	// Arrange
	const buffer = Buffer.from('00', 'hex');
	const bit_stream = new BitStream(buffer, 0);
	const enum_table = new Set();

	// Act
	const act = () => {
		bit_stream.read_enum(enum_table);
	};

	// Assert
	expect(act).toThrow(new IllformedStreamError('Enum: Unknown value: 0'));
});
