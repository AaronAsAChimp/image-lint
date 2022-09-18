/* @flow */
'use strict';

import {ImageIdentifier} from '../ident.js';
import {RIFFIdentifier} from './riff-ident.js';
const WEBP_TYPE_TAG = 0x57454250;

/**
 * An image identifier that identifies WebP images.
 */
class WebPIdentifier extends RIFFIdentifier {
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

ImageIdentifier.register(WebPIdentifier);
