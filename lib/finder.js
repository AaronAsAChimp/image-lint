'use strict';

const path = require('path'),
	  fs = require('fs');

function *finder(initital_items, extensions) {
	var queue = initital_items.slice(0);

	if (!queue.length){
		throw new Error('No files or folders specified');
	}

	while (queue.length) {
		let file_path = queue.shift(),
			file = {
				'path': file_path,
				'stats': fs.lstatSync(file_path)
			};

		if (file.stats.isDirectory()) {
			let contents = fs.readdirSync(file.path);

			for (let sub_path of contents) {
				queue.push(path.join(file.path, sub_path));
			}
		} else if (file.stats.isFile()) {
			let extension = path.extname(file.path);

			if (extensions.indexOf(extension) >= 0) {
				yield file.path;
			}
		}
	}
}

module.exports = finder;
