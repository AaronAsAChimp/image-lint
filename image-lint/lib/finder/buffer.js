/* @flow */

const Finder = require('../finder'),
	  BlobLoader = require('../loader/blob'),
	  path = require('path');

/*::
import type { FileDescriptor } from '../finder';
 */

/**
 * Finds files in a Browser Blob object.
 */
class BufferArrayFinder extends Finder {
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
				'path': '',
				'extension': extension,
				'loader': new BlobLoader(file),
			};
		}
	}
}

module.exports = BufferArrayFinder;
