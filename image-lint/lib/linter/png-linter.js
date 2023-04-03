import {ImageLinter} from '../image-linter.js';
import {PNGChunk, FIRST_CHUNK_OFFSET} from '../image/png/chunk.js';

/**
 * Specialized linting for PNG files.
 */
export class PNGImageLinter extends ImageLinter {
	/**
	 * Create a new PNGImageLinter
	 * @param  {Buffer} buffer The image buffer
	 */
	constructor(buffer) {
		super();

		this.buffer = buffer;
	}

	/**
	 * @inheritdoc
	 */
	lint(logger) {
		const chunks = PNGChunk.get_chunks(this.buffer, FIRST_CHUNK_OFFSET);
		const last_chunk = chunks[chunks.length - 1];

		// Detect images affected by the Acropalypse vulnerability by comparing
		// the parsed length to the total length of the file.
		//
		// The doesn't guarantee that this was an affected file, but it does
		// show there is extra data after the IEND. Either way this is a
		// problem and could be a potential file savings improvement.
		if (last_chunk.offset + last_chunk.get_total_length() < this.buffer.length) {
			logger.error('This file contains extra data at the end of the file.');
		}
	}
}
