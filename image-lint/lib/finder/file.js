'use strict';
/* @flow */

import {Finder} from '../finder.js';
import {FsLoader} from '../loader/fs.js';
import path from 'path';
import fs from 'fs';

/*::
import type { FileDescriptor } from '../finder';
 */

const EXCLUDES = new Set([
	'node_modules',
	'.git',
	'.svn',
]);

/**
 * Find files in a file system.
 */
export class FileFinder extends Finder {
	/**
	 * @inheritdoc
	 */
	get_files(initital_items/*: string[] */)/*: Promise<Iterable<FileDescriptor>> */ {
		const queue = initital_items.slice(0);

		if (!queue.length) {
			throw new Error('No files or folders specified');
		}

		return Promise.resolve(this._search.bind(this, queue));
	}

	/**
	 * Traverse the file system yielding any files it finds.
	 *
	 * @param {string[]} queue  The initial queue items.
	 */
	* _search(queue/*: string[] */)/*: Iterable<FileDescriptor> */ {
		while (queue.length) {
			const file_path = queue.shift();
			const stats = fs.lstatSync(file_path);
			let excluded = false;

			// Skip any folder that is excluded.
			for (const exclude of EXCLUDES) {
				if (file_path.endsWith(exclude)) {
					excluded = true;
				}
			}

			if (!excluded) {
				if (stats.isDirectory()) {
					const contents = fs.readdirSync(file_path);

					for (const sub_path of contents) {
						queue.push(path.join(file_path, sub_path));
					}
				} else if (stats.isFile()) {
					const extension = path.extname(file_path);

					if (extension && this.is_image_extension(extension)) {
						yield {
							'path': file_path,
							'extension': extension,
							'loader': new FsLoader(file_path),
						};
					}
				}
			}
		}
	}
}
