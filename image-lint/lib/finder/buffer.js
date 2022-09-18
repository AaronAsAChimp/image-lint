/* @flow */

import {Finder} from '../finder.js';
import {BlobLoader} from '../loader/blob.js';
import path from 'path';

/*::
import type { FileDescriptor } from '../finder';
 */

/**
 * Finds files in a Browser Blob object.
 */
export class BufferArrayFinder extends Finder {
	/*::
	filename: string;
	path: string;
	buffer: Buffer;
	*/

	/**
	 * @inheritdoc
	 */
	get_files(initial_files/*: string[] */)/*: Promise<Iterable<FileDescriptor>> */ {
		return Promise.resolve(this._search.bind(this, initial_files));
	}

	/**
	 * Traverse the file system yielding any files it finds.
	 *
	 * @param {Blob[]} files  The initial queue items.
	 */
	* _search(files/*: Blob[] */)/*: Generator<FileDescriptor, *, *> */ {
		for (const file of files) {
			const extension = path.extname(file.name);

			yield {
				'path': file.name,
				'extension': extension,
				'loader': new BlobLoader(file),
			};
		}
	}
}
