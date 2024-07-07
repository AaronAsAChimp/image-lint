import {read_chunks, CHUNK_ID_LENGTH, CHUNK_LENGTH_LENGTH, SUBCHUNK_ID_LENGTH} from './reader.js';


/**
 * A RIFF chunk
 */
export class BaseChunk {
	/**
	 * Construct a new base chunk.
	 *
	 * @param  {Buffer} buffer The file buffer.
	 * @param  {string} chunk_id The id of the chunk.
	 * @param  {number} offset The offset of the beginning of the chunk.
	 */
	constructor(buffer, chunk_id, offset) {
		this.offset = offset;
		this.header = chunk_id;
		this.length = buffer.readUInt32LE(offset + CHUNK_ID_LENGTH);
		this.data = buffer.subarray(
			offset + CHUNK_ID_LENGTH + CHUNK_LENGTH_LENGTH,
			offset + CHUNK_ID_LENGTH + CHUNK_LENGTH_LENGTH + this.length,
		);
	}

	/**
	 * Get the total length of the chunk. This is different from the length
	 * property that is only the data length.
	 *
	 * @returns {number} The length of the chunks.
	 */
	get_total_length() {
		const padding_byte = this.length % 2;

		return CHUNK_ID_LENGTH + CHUNK_LENGTH_LENGTH + this.length + padding_byte;
	}

	/**
	 * Describe this chunk.
	 *
	 * @returns {string} The description of this chunk.
	 */
	describe() {
		return `${ this.header } (offset: ${ this.offset }, length: ${ this.length })`;
	}
}

/**
 * A chunk for a RIFF file that contains simple data.
 */
export class SimpleChunk extends BaseChunk {

}

/**
 * A RIFF chunk. This chunk can contain child chunks
 */
export class RIFFChunk extends BaseChunk {
	/**
	 * Construct a RIFF chunk.
	 *
	 * @param  {Buffer} buffer The file buffer.
	 * @param  {string} chunk_id The id of the chunk.
	 * @param  {number} offset The offset of the beginning of the chunk.
	 * @param  {Record<string, BaseChunk>} chunk_types The acceptable types of chunks.
	 */
	constructor(buffer, chunk_id, offset, chunk_types) {
		super(buffer, chunk_id, offset);

		this.subchunk_id = this.data.toString('ascii', offset, offset + SUBCHUNK_ID_LENGTH);

		this.subchunks = read_chunks(
			buffer,
			offset + CHUNK_ID_LENGTH + CHUNK_LENGTH_LENGTH + SUBCHUNK_ID_LENGTH,
			chunk_types,
		);
	}

	/**
	 * @inheritDoc
	 */
	describe() {
		return super.describe() + `\n\nSubchunk Id: ${this.subchunk_id}\nNumber of subchunks: ${ this.subchunks.length }\n` + this.subchunks.map((chunk) => chunk.describe()).join('\n');
	}
}
