'use strict';

const Finder = require('../finder.js'),
	  path = require('path'),
	  fs = require('fs');

class FileFinder extends Finder {

	load() {
		// this method gets detached and returned
		let file = this;

		return new Promise((resolve, reject) => {
			fs.readFile(file.path, (err, buffer) => {
				if (err) {
					reject(err);
				}

				file.buffer = buffer;

				resolve(file);
			});
		});
	}

	get_files(initital_items) {
		var queue = initital_items.slice(0),
			found = [];

		if (!queue.length){
			throw new Error('No files or folders specified');
		}

		return Promise.resolve(this._search.bind(this, queue));
	}

	*_search (queue) {
		let load_proxy = this.load;

		while (queue.length) {
			let file_path = queue.shift(),
				stats = fs.lstatSync(file_path);

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
						'load': load_proxy
					};
				}
			}
		}
	}
}

module.exports = FileFinder;
