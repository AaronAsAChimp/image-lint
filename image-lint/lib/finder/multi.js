import {Finder} from '../finder.js';
import {FileFinder} from './file.js';
import {WebFinder} from './web-puppeteer.js';
// import {GitFinder} from './git.js';

/**
 * Use multiple strategies to find files. It will parse the paths passed to
 * `get_files()` and use that information to choose the correct finder.
 */
export class MultiFinder extends Finder {
	/** @type {number} */
	_num_finders;

	/** @type {Record<string, Finder>} */
	finders;

	/**
	 * Construct a new MultiFinder
	 *
	 * @param  {string[]} extensions The file extensions to look for.
	 * @param  {string[]} mimes      The MIMEs to look for.
	 */
	constructor(extensions, mimes) {
		super(extensions, mimes);

		this._num_finders = 2;

		this.finders = {
			'file': new FileFinder(extensions, mimes),
			'web': new WebFinder(extensions, mimes),
			// 'git': new GitFinder(extensions, mimes)
		};
	}

	/**
	 * @inheritdoc
	 */
	async get_files(files) {
		const split_files = {};

		// Split the list of files into lists of files appropriate for each type
		// of finder.
		for (const file of files) {
			const proto = file.split(':', 2)[0];
			let finder_type = 'file';

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

		const files_promises = [];

		for (const type in this.finders) {
			if (split_files[type] && split_files[type].length) {
				files_promises.push(this.finders[type].get_files(split_files[type]));
			}
		}

		const file_iterators = await Promise.all(files_promises);
		let pos = 0;
		let next_iterator = file_iterators[pos];

		return {
			next() {
				/** @type {IteratorResult<import('../finder.js').FileDescriptor>} */
				let result = {value: null, done: true};

				do {
					result = next_iterator.next();
					if (!result.done) {
						break;
					}
					next_iterator = file_iterators[pos++];
				} while (next_iterator);

				return result;
			},
		};
	}
}
