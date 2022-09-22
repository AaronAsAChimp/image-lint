import {Finder} from '../finder.js';
import {FileFinder} from './file.js';
import tmp from 'tmp';


/**
 * A base class for finding files in Version Control Systems. An implementation
 * should prepare the workspace and the this class will delegate the finding to
 * the FileFinder.
 */
export class VcsFinder extends Finder {
	/**
	 * Prepare the workspace that contains all of the files to be tested.
	 *
	 * @abstract
	 * @param { string[] } clone_urls An array of urls to clone.
	 * @return {Promise<string[]>} A promise that resolves to an array of file paths.
	 */
	prepare_workspace(clone_urls) {
		throw new Error('Not Implemented');
	}

	/**
	 * Get a temporary workspace folder that the files can be placed during the
	 * `prepare_workspace()` method @return {[type]} [description]
	 *
	 * @return {Promise<string>} A promise that resolves to the path of
	 *                           the folder
	 */
	get_workspace() {
		return new Promise((resolve, reject) => {
			tmp.dir({
				'unsafeCleanup': true,
			}, (err, path, cleanup) => {
				if (!err) {
					resolve(path);
				} else {
					reject(err);
				}
			});
		});
	}

	/**
	 * @inheritdoc
	 */
	get_files(clone_urls) {
		return this.prepare_workspace(clone_urls)
			.then((paths) => {
				const file_finder = new FileFinder(this.extensions, this.mimes);

				return file_finder.get_files(paths);
			});
	}
}
