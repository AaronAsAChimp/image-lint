'use strict';
/* @flow */

const EventEmitter = require('events');

/*::
export
interface FileDescriptor {
	path: string;
	extension: string;
	buffer?: Buffer;
	load: () => Promise<FileDescriptor>;
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
	 * This method get attached to the file descriptor. When called, it will
	 * load the file its attached to into the buffer property.
	 * 
	 * @return {Promise<FileDescriptor>} The same file descriptor with the buffer property filled in.
	 */
	load ()/*: Promise<FileDescriptor> */ {
		throw new Error('Not Implemented');
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

	is_image_extension(ext/*: string */) {
		return this.extensions.indexOf(ext) >= 0;
	}

	is_image_mime(mime/*: string */) {
		return this.mimes.indexOf(mime) >= 0;
	}
}

module.exports = Finder;
