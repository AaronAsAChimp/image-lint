const VcsFinder = require('./vcs.js'),
	Git = require('nodegit');


class GitFinder extends VcsFinder {

	prepare_workspace(clone_urls) {
		let promises = clone_urls.map((url) => {

			return this.get_workspace()
				.then((file_path) => {
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