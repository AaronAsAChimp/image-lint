'use strict';

const Finder = require('../finder.js'),
	  FileFinder = require('./file.js'),
	  WebFinder = require('./web.js');
	  // GitFinder = require('./git.js');


/**
 * Use multiple strategies to find files.
 */
class MultiFinder extends Finder {
	constructor(extensions, mimes) {
		super(extensions, mimes);

		this._num_finders = 2;

		this.finders = {
			'file': new FileFinder(extensions, mimes),
			'web': new WebFinder(extensions, mimes),
			// 'git': new GitFinder(extensions, mimes)
		};
	}

	get_files(files) {
		let finder = this,
			split_files = {};

		// Split the list of files into lists of files appropriate for each type
		// of finder.
		for (let file of files) {
			let proto = file.split(':', 2)[0],
				finder_type = 'file';

			if (proto === 'git' || file.endsWith('.git')) {
				finder_type = 'git';
			} else if (proto === 'http' || proto === 'https') {
				finder_type = 'web';
			} 
 
			if (!split_files[finder_type]) {
				split_files[finder_type] = [];
			}

			split_files[finder_type].push(file);
		}

		return new Promise((resolve, reject) => {
			let types_completed = 0,
				found = [],
				files_found = (iterator) => {
					found.push(iterator);
					types_completed--;

					if (types_completed <= 0) {
						resolve(function* () {
							for (let iterator of found) {
								yield* iterator();
							}
						});
					}
				};

			for (let type in this.finders) {
				if (split_files[type] && split_files[type].length) {
					types_completed++;

					this.finders[type].get_files(split_files[type])
						.then(files_found, reject)
						.catch(reject);
				}
			}
		});
	}
}

module.exports = MultiFinder;
