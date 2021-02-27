'use strict';
/* @flow */

const Finder = require('../finder.js'),
	  FsLoader = require('../loader/fs'),
	  path = require('path'),
	  fs = require('fs');

/*::
import type { FileDescriptor } from '../finder';
 */

const EXCLUDES = new Set([
	'node_modules',
	'.git',
	'.svn'
]);

class FileFinder extends Finder {

	get_files(initital_items/*: string[] */)/*: Promise<Iterable<FileDescriptor>> */ {
		var queue = initital_items.slice(0),
			found = [];

		if (!queue.length){
			throw new Error('No files or folders specified');
		}

		return Promise.resolve(this._search.bind(this, queue));
	}

	*_search (queue/*: string[] */)/*: Iterable<FileDescriptor> */ {
		while (queue.length) {
			let file_path = queue.shift(),
				stats = fs.lstatSync(file_path),
				excluded = false;

			// Skip any folder that is excluded.
			for (let exclude of EXCLUDES) {
				if (file_path.endsWith(exclude)) {
					excluded = true;
				}
			}

			if (!excluded) {
				if (stats.isDirectory()) {
					let contents = fs.readdirSync(file_path);

					for (let sub_path of contents) {
						queue.push(path.join(file_path, sub_path));
					}
				} else if (stats.isFile()) {
					let extension = path.extname(file_path);

					if (extension && this.is_image_extension(extension)) {
						yield {
							'path': file_path,
							'extension': extension,
							'loader': new FsLoader(file_path)
						};
					}
				}
			}
		}
	}
}

module.exports = FileFinder;
