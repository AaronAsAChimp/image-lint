const Finder = require('../finder.js'),
	  FileFinder = require('./file.js'),
	  tmp = require('tmp');


class VcsFinder extends Finder {
	/**
	 * Prepare the workspace that contains all of the files to be tested.
	 *
	 * @param { string[] } clone_urls An array of urls to clone.
	 * @return {Promise<string[]>} A promise that resolves to an array of file paths.
	 */
	prepare_workspace(clone_urls) {
		throw new Error('Not Implemented');
	}

	get_workspace() {
		return new Promise((resolve, reject) => {
			tmp.dir({
				'unsafeCleanup': true
			}, (err, path, cleanup) => {
				if (!err) {
					resolve(path);
				} else {
					reject(err);
				}
			});
		});
	}

	get_files(clone_urls) {
		return this.prepare_workspace(clone_urls)
			.then((paths) => {
				let file_finder = new FileFinder(this.extensions, this.mimes);

				return file_finder.get_files(paths);
			});
	}
}

module.exports = VcsFinder;