'use strict';
/* @flow */

const EventEmitter = require('events');

/*::
import type Loader from './loader';

export interface FileDescriptor {
	path: string;
	extension: string;
	loader: Loader;
}
 */

class Finder {
	/*::
	extensions: string[];
	mimes: string[];
	 */

	constructor(extensions/*: string[] */, mimes/*: string[]*/) {
		this.extensions = extensions;
		this.mimes = mimes;
	}

	/**
	 * Get an iterator of unresolved file descriptors.
	 *
	 * @param {string[]} initial_items The initial set of items to be searched for.
	 *
	 * @return {Promise<Iterable<FileDescriptor>>} An iterator of file descriptors.
	 */
	get_files(initial_items/*: string[] */)/*: Promise<Iterable<FileDescriptor>> */ {
		throw new Error('Not Implemented');
	}

	is_image_extension(ext/*: string */)/*: boolean */ {
		return this.extensions.indexOf(ext) >= 0;
	}

	is_image_mime(mime/*: string */)/*: boolean */ {
		return this.mimes.indexOf(mime) >= 0;
	}
}

module.exports = Finder;
