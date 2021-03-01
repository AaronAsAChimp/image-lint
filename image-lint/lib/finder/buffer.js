/* @flow */

const Finder = require('../finder'),
	  FsLoader = require('../loader/fs'),
	  path = require('path'),
	  fs = require('fs');

/*::
import type { FileDescriptor } from '../finder';
 */

class BufferArrayFinder extends Finder {
	/*::
	filename: string;
	path: string;
	buffer: Buffer;
	*/

	constructor(extensions/*: string[] */, mimes/*: string[] */) {
		super(extensions, mimes);
	}

	get_files(initial_files/*: string[] */)/*: Promise<Iterable<FileDescriptor>> */ {
		return Promise.resolve(this._search.bind(this, initial_files));
	}

	*_search (files/*: string[] */)/*: Generator<FileDescriptor, *, *> */ {
		for (let file of files) {
			let extension = path.extname(file.filename);

			yield {
				'path': file.path,
				'extension': extension,
				'loader': new FsLoader(file.path)
			};
		}
	}

}

module.exports = BufferArrayFinder;
