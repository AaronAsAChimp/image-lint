import {ImageLinter} from '../image-linter.js';
import {JPEGChunk, MARKER_LENGTH} from '../image/jpg/chunk.js';

/**
 * Specialized linting for PNG files.
 */
export class JPEGImageLinter extends ImageLinter {
	/**
	 * Create a new PNGImageLinter
	 *
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
		const chunks = JPEGChunk.get_chunks(this.buffer, 0);
		const last_chunk = chunks[chunks.length - 1];

		// console.group('file');
		// for (const chunk of chunks) {
		// 	console.log(chunk.describe(), chunk.length);
		// }
		// console.groupEnd('file');

		const last_chunk_length = last_chunk.length ?? MARKER_LENGTH;

		// Detect images affected by the Acropalypse vulnerability by comparing
		// the parsed length to the total length of the file.
		//
		// The doesn't guarantee that this was an affected file, but it does
		// show there is extra data after the EOI. Either way this is a
		// problem and could be a potential file savings improvement.
		if (last_chunk.offset + last_chunk_length < this.buffer.length) {
			logger.error('This file contains extra data at the end of the file.');
		}
	}
}
