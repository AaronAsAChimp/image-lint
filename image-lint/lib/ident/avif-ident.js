import {ImageIdentifier} from '../ident.js';
import {AVIFInfoProvider} from '../image/avif-info.js';
import {RootBlock} from '../image/isobmff/isobmff.js';

const FTYP_START = 4;
const FTYPE_LENGTH = 8;

/**
 * An image identifier that identifies AVIF images.
 */
export default class AVIFIdentifier extends ImageIdentifier {
	/**
	 * @inheritDoc
	 */
	can_validate(buffer) {
		return buffer.length > (FTYP_START + FTYPE_LENGTH);
	}

	/**
	 * @inheritDoc
	 */
	is_of_file_type(buffer) {
		const ftyp = buffer.subarray(FTYP_START, FTYP_START + FTYPE_LENGTH).toString('ascii');

		return ftyp === 'ftypavif' || ftyp === 'ftypheic';
	}

	/**
	 * @inheritDoc
	 */
	get_extensions() {
		return [
			'.avif',
			'.heif',
			'.heic',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_mimes() {
		return [
			'image/avif',
			'image/heif',
			'image/heic',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_info_provider() {
		return AVIFInfoProvider;
	}


	/**
	 * @inheritDoc
	 */
	debug_print(buffer, write_stream) {
		const root = new RootBlock(buffer);

		write_stream.write(root.describe());
	}
}
