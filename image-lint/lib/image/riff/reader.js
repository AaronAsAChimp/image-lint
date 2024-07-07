import {RIFFChunk, SimpleChunk} from './chunk.js';

export const CHUNK_ID_LENGTH = 4;
export const CHUNK_LENGTH_LENGTH = 4;
export const SUBCHUNK_ID_LENGTH = 4;

/**
 * Read all of the chunks in the buffer.
 *
 * @param  {Buffer} buffer The file buffer.
 * @param  {number} offset The off of the beginning of the chunks.
 * @param  {Record<string, BaseChunk>} chunk_types The types of chunks in this RIFF file
 * @returns {BaseChunk[]}  The chunks.
 */
export function read_chunks(buffer, offset, chunk_types) {
	const chunks = [];
	let current_offset = offset;

	while (current_offset < buffer.length) {
		const chunk_id = buffer.toString('ascii', current_offset, current_offset + CHUNK_ID_LENGTH);
		let chunk;

		if (chunk_id === 'RIFF') {
			chunk = new RIFFChunk(buffer, chunk_id, current_offset, chunk_types);
		} else if (chunk_id in chunk_types) {
			chunk = new chunk_types[chunk_id](buffer, chunk_id, current_offset);
		} else {
			// console.warn('Unknown chunk id', chunk_id);
			chunk = new SimpleChunk(buffer, chunk_id, current_offset);
		}

		chunks.push(chunk);

		current_offset += chunk.get_total_length();
	}

	return chunks;
}
