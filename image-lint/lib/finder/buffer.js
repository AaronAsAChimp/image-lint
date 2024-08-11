import {Finder} from '../finder.js';
import {BlobLoader} from '../loader/blob.js';

/**
 * A browser friendly implementation of path.extname.
 *
 * @param {string} path The path to get the extension from.
 * @returns {string} The extension for an empty string if there is none.
 */
function extname(path) {
	const dot_index = path.lastIndexOf('.');

	if (dot_index > 0) {
		return path.substring(dot_index);
	} else {
		return '';
	}
}

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
	 * @param {File[]} files  The initial queue items.
	 * @yields {FileDescriptor}
	 */
	* _search(files) {
		for (const file of files) {
			const extension = extname(file.name);

			yield {
				'path': file.name,
				'extension': extension,
				'loader': new BlobLoader(file),
			};
		}
	}
}
