'use strict';
/* @flow */


/*::
import type Loader from './loader';

export interface FileDescriptor {
	path: string;
	extension: string;
	loader: Loader;
}
 */

/**
 * A base class for finding files in different mediums.
 */
export class Finder {
	/*::
	extensions: string[];
	mimes: string[];
	 */

	/**
	 * Construct a new Finder
	 * @param  {string[]} extensions The list of extensions to look for.
	 * @param  {string[]} mimes      The list of MIME types to look for.
	 */
	constructor(extensions/*: string[] */, mimes/*: string[]*/) {
		this.extensions = extensions;
		this.mimes = mimes;
	}

	/**
	 * Get an iterator of unresolved file descriptors.
	 *
	 * @abstract
	 * @param {Promise<Iterable<FileDescriptor>>} initial_items The initial set of items to be searched for.
	 */
	get_files(initial_items/*: string[] */)/*: Promise<Iterable<FileDescriptor>> */ {
		throw new Error('Not Implemented');
	}

	/**
	 * Determine if the provided extension is an image extension (provided in
	 * the constructor).
	 *
	 * @param {string}  ext The extension to check.
	 * @return {boolean}    True if it is an image extension, false otherwise.
	 */
	is_image_extension(ext/*: string */)/*: boolean */ {
		return this.extensions.indexOf(ext) >= 0;
	}

	/**
	 * Determine if the provided MIME type is an image MIME type (provided in
	 * the constructor).
	 *
	 * @param {string}  mime The MIME type to check.
	 * @return {boolean}     True if it is an image MIME type, false otherwise.
	 */
	is_image_mime(mime/*: string */)/*: boolean */ {
		return this.mimes.indexOf(mime) >= 0;
	}
}
