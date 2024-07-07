import {MagicNumberIdentifier} from './magic-number-ident.js';
import {PNGInfoProvider} from '../image/png-info.js';
import {PNGImageLinter} from '../linter/png-linter.js';
import {PNGChunk, FIRST_CHUNK_OFFSET} from '../image/png/chunk.js';

/**
 * An image identifier that identifies PNG images.
 */
export default class PNGIdentifier extends MagicNumberIdentifier {
	/**
	 * @inheritDoc
	 */
	get_magic() {
		return Buffer.from('89504e470d0a1a0a', 'hex');
	}

	/**
	 * @inheritDoc
	 */
	get_extensions() {
		return [
			'.png',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_mimes() {
		return [
			'image/png',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_info_provider() {
		return PNGInfoProvider;
	}

	/**
	 * @inheritDoc
	 */
	get_linter(buffer) {
		return new PNGImageLinter(buffer);
	}

	/**
	 * @inheritDoc
	 */
	debug_print(buffer, write_stream) {
		const chunks = PNGChunk.get_chunks(buffer, FIRST_CHUNK_OFFSET);

		write_stream.write(`Number of chunks: ${chunks.length}\n`);

		for (const chunk of chunks) {
			write_stream.write(chunk.describe());
			write_stream.write('\n');
		}
	}
}
