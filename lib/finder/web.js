'use strict';

const Finder = require('../finder.js'),
	  request = require('request'),
	  url = require('url'),
	  path = require('path'),
	  phantom = require('node-phantom-simple');

class WebFinder extends Finder {

	load() {
		// this method gets detached
		let file = this;

		return new Promise((resolve, reject) => {
			request({
				url: file.path,
				gzip: true,
				encoding: null
			}, function (err, response, body) {
				if (err) {
					reject(err);
				}

				if (response.statusCode >= 400) {
					reject('Encountered HTTP error: ' + response.statusMessage);
				}

				file.buffer = body;

				resolve(file);
			});
		});
	}

	get_files(urls) {
		let load_proxy = this.load;
		//console.log('getting urls');
		//console.log('spinnig up phantom');

		return new Promise((resolve, reject) => {
			let finder = this,
				urls_seen = new Set(),
				found = [];

			phantom.create((err, browser) => {
				if (err) {
					console.log(err);
					reject(err);
					return;
				}

				let timeout = setTimeout(() => {
					//console.log('timeout, resolving anyway');

					browser.exit();
					resolve(found[Symbol.iterator].bind(found));
				}, 10000);

				//console.log('creating page');

				return browser.createPage((err, page) => {
					if (err) {
						console.log(err);
						reject(err);
						return;
					}

					page.onResourceRequested = function(requestData, networkRequest) {
						let found_url = requestData.url;

						// Check that we haven't seen this URL before to save us
						// from doing work we've already done
						if (found_url.length && !urls_seen.has(found_url)) {
							let url_parts = url.parse(found_url);

							// The pathname can be null if the url is malformed.
							if (url_parts.pathname) {
								let ext = path.extname(url_parts.pathname);

								if (finder.is_image_extension(ext)) {
									urls_seen.add(found_url);
									found.push({
										'path': found_url,
										'extension': ext,
										'load': load_proxy
									});
								}
							}
						}

					};

					page.onLoadFinished = function (status) {
						//console.log('load finished');

						clearTimeout(timeout);

						page.close();
						browser.exit();
						resolve(found[Symbol.iterator].bind(found));
					};

					page.set('userAgent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36');

					//console.log('loading site', url);

					page.open(urls, function (err, status) {
						//console.log('loaded');
						if (err) {
							console.log(err);
							reject(err);
							return;
						}
					});

				});
			});
		});

	}
}

module.exports = WebFinder;
