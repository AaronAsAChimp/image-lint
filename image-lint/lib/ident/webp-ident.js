import {RIFFIdentifier} from './riff-ident.js';
import {WEBPInfoProvider} from '../image/webp-info.js';
import {read_chunks} from '../image/vp8/vp8.js';

const WEBP_TYPE_TAG = 0x57454250;

/**
 * An image identifier that identifies WebP images.
 */
export default class WebPIdentifier extends RIFFIdentifier {
	/**
	 * @inheritDoc
	 */
	get_type_tag() {
		return WEBP_TYPE_TAG;
	}

	/**
	 * @inheritDoc
	 */
	get_extensions() {
		return [
			'.webp',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_mimes() {
		return [
			'image/webp',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_info_provider() {
		return WEBPInfoProvider;
	}

	/**
	 * @inheritDoc
	 */
	debug_print(buffer, write_stream) {
		const chunks = read_chunks(buffer, 0);

		write_stream.write(`Number of chunks: ${chunks.length}\n`);

		for (const chunk of chunks) {
			write_stream.write(chunk.describe());
			write_stream.write('\n');
		}
	}
}
