import {Bitstream} from '../bitstream/bitstream.js';
import {BaseChunk, SimpleChunk} from '../riff/chunk.js';
import {read_chunks as riff_read_chunks} from '../riff/reader.js';

/**
 * The WebP Lossless Chunk
 * https://developers.google.com/speed/webp/docs/webp_lossless_bitstream_specification
 */
class VP8LChunk extends BaseChunk {
	/**
	 * Construct a new VP8L Chunk
	 *
	 * @param  {Buffer} buffer The file buffer.
	 * @param  {string} chunk_id The id of the chunk.
	 * @param  {number} offset The offset of the beginning of the chunk.
	 */
	constructor(buffer, chunk_id, offset) {
		super(buffer, chunk_id, offset);

		const bitstream = new Bitstream(this.data, 0);
		// compulsory byte
		this.is_valid = bitstream.read_bits(8) === 0x2F;
		this.width = bitstream.read_bits(14) + 1;
		this.height = bitstream.read_bits(14) + 1;
	}

	/**
	 * @inheritDoc
	 */
	describe() {
		return super.describe() +
			'\n  Width: ' + this.width +
			'\n  Height: ' + this.height;
	}
}

const VERSIONS = [
	'Bicubic, Normal Loop Filter',
	'Bilinear, Simple Loop Filter',
	'Bilinear, No Loop Filter',
	'No Reconstruction Filter, No Loop Filter',
	'Unknown', // Reserved for future use
];

/**
 * The WebP Lossy Chunk
 * https://datatracker.ietf.org/doc/html/rfc6386#page-30
 */
class VP8Chunk extends BaseChunk {
	/**
	 * Construct a new VP8 Chunk
	 *
	 * @param  {Buffer} buffer The file buffer.
	 * @param  {string} chunk_id The id of the chunk.
	 * @param  {number} offset The offset of the beginning of the chunk.
	 */
	constructor(buffer, chunk_id, offset) {
		super(buffer, chunk_id, offset);

		const bitstream = new Bitstream(this.data, 0);
		this.frame_type = bitstream.read_boolean();
		this.version = bitstream.read_bits(3);
		this.show_frame = bitstream.read_boolean();
		this.data_partition_size = bitstream.read_bits(19);

		// compulsory bytes.
		this.is_valid = bitstream.read_bits(8) === 0x9d &&
			bitstream.read_bits(8) === 0x01 &&
			bitstream.read_bits(8) === 0x2A;

		this.width = bitstream.read_bits(14);
		this.horz_scale = bitstream.read_bits(2);
		this.height = bitstream.read_bits(14);
		this.vert_scale = bitstream.read_bits(2);
	}

	/**
	 * @inheritDoc
	 */
	describe() {
		return super.describe() +
			'\n  Frame Type: ' + (this.frame_type ? 'interframe' : 'keyframe') +
			'\n  Version: ' + this.version + ' (' + VERSIONS[this.version] + ')' +
			'\n  Show Frame: ' + this.show_frame +
			'\n  Valid: ' + this.is_valid +
			'\n  Width: ' + this.width +
			'\n  Height: ' + this.height;
	}
}

const VP8X_FLAGS_LENGTH = 4;
const VP8X_WIDTH_LENGTH = 3;

/**
 * Read a Little-Endian 24 bit unsigned integer from a buffer
 *
 * @param  {Buffer} buffer The buffer
 * @param  {number} offset The offset from the start of the buffer.
 * @returns {number}       The 24bit integer.
 */
function readUint24LE(buffer, offset) {
	const low_byte = buffer.readUInt8(offset);
	const middle_byte = buffer.readUInt8(offset + 1);
	const high_byte = buffer.readUInt8(offset + 2);

	return (high_byte << 16) | (middle_byte << 8) | low_byte;
}

/**
 * The WebP Lossy Chunk
 * https://developers.google.com/speed/webp/docs/riff_container#extended_file_format
 */
class VP8XChunk extends BaseChunk {
	/**
	 * Construct a new VP8X Chunk
	 *
	 * @param  {Buffer} buffer The file buffer.
	 * @param  {string} chunk_id The id of the chunk.
	 * @param  {number} offset The offset of the beginning of the chunk.
	 */
	constructor(buffer, chunk_id, offset) {
		super(buffer, chunk_id, offset);

		this.width = readUint24LE(this.data, VP8X_FLAGS_LENGTH) + 1;
		this.height = readUint24LE(this.data, VP8X_FLAGS_LENGTH + VP8X_WIDTH_LENGTH) + 1;
	}

	/**
	 * @inheritDoc
	 */
	describe() {
		return super.describe() +
			'\n  Width: ' + this.width +
			'\n  Height: ' + this.height;
	}
}

export const VP8_CHUNK_TYPES = {
	'VP8 ': VP8Chunk,
	'VP8L': VP8LChunk,
	'VP8X': VP8XChunk,
	'ANIM': SimpleChunk,
	'ANMF': SimpleChunk,
};

/**
 * Read all of the chunks in the buffer.
 *
 * @param  {Buffer} buffer The file buffer.
 * @param  {number} offset The off of the beginning of the chunks.
 * @returns {BaseChunk[]}  The chunks.
 */
export function read_chunks(buffer, offset) {
	return riff_read_chunks(buffer, offset, VP8_CHUNK_TYPES);
}
