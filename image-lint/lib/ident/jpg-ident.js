import {MagicNumberIdentifier} from './magic-number-ident.js';
import {JPGInfoProvider} from '../image/jpg-info.js';
import {JPEGImageLinter} from '../linter/jpg-linter.js';
import {JPEGChunk} from '../image/jpg/chunk.js';

/**
 * An image identifier that identifies JPEG images.
 */
export default class JPGIdentifier extends MagicNumberIdentifier {
	/**
	 * @inheritDoc
	 */
	get_magic() {
		return Buffer.from('ffd8ff', 'hex');
	}

	/**
	 * @inheritDoc
	 */
	get_extensions() {
		return [
			'.jpg',
			'.jpeg',
			'.jpe',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_mimes() {
		return [
			'image/jpeg',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_info_provider() {
		return JPGInfoProvider;
	}

	/**
	 * @inheritDoc
	 */
	get_linter(buffer) {
		return new JPEGImageLinter(buffer);
	}


	/**
	 * @inheritDoc
	 */
	debug_print(buffer, write_stream) {
		const chunks = JPEGChunk.get_chunks(buffer, 0);

		write_stream.write(`Number of chunks: ${chunks.length}\n`);

		for (const chunk of chunks) {
			write_stream.write(chunk.describe());
			write_stream.write('\n');
		}
	}
}
