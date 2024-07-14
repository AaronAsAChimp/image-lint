import {Finder} from '../finder.js';
import {BlobLoader} from '../loader/blob.js';
import path from 'path';

/**
 * Finds files in a Browser Blob object.
 */
export class BufferArrayFinder extends Finder {
	/** @type {string} */
	filename;

	/** @type {string} */
	path;

	/** @type {Buffer} */
	buffer;

	/**
	 * @inheritdoc
	 */
	async get_files(initial_files) {
		return this._search(initial_files);
	}

	/**
	 * Traverse the file system yielding any files it finds.
	 *
	 * @param {Blob[]} files  The initial queue items.
	 * @yields {FileDescriptor}
	 */
	* _search(files) {
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
