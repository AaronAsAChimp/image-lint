const VcsFinder = require('./vcs.js'),
	Git = require('nodegit');


/**
 * Find files located in a git repositiory. It just clones the repository and
 * delegates to the FileFinder.
 */
class GitFinder extends VcsFinder {
	/**
	 * @inheritdoc
	 */
	prepare_workspace(clone_urls) {
		const promises = clone_urls.map((url) => {
			return this.get_workspace()
				.then((file_path) => {
					// eslint-disable-next-line new-cap
					return Git.Clone(url, file_path)
						.then(() => {
							return file_path;
						});
				});
		});

		return Promise.all(promises);
	}
}

module.exports = GitFinder;
