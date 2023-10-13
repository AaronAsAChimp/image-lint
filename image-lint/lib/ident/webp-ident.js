/* @flow */
'use strict';

import {RIFFIdentifier} from './riff-ident.js';
import {WEBPInfoProvider} from '../image/webp-info.js';
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

}
