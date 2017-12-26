/* @flow */

const Finder = require('../finder'),
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

	load ()/*: Promise<Finder> */ {
		let file = this;

		return new Promise((resolve, reject) => {
			fs.readFile(this.path, (err, buffer, enc) => {
				if (err) {
					reject(err);
				}

				file.buffer = buffer;

				resolve(file);
			});
		});
	}

	get_files(initial_files/*: string[] */)/*: Promise<Iterable<FileDescriptor>> */ {
		return Promise.resolve(this._search.bind(this, initial_files));
	}

	*_search (files/*: string[] */)/*: Generator<*, *, *> */ {
		let load_proxy = this.load;

		for (let file of files) {
			let extension = path.extname(file.filename);

			yield {
				'path': file.path,
				'extension': extension,
				'load': load_proxy
			};
		}
	}

}

module.exports = BufferArrayFinder;
