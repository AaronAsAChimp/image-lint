/* @flow */
const request = require('request'),
      Loader = require('../loader');

class HttpLoader extends Loader {
    load()/*: Promise<Buffer> */ {
        return new Promise((resolve, reject) => {
			request({
				url: this.getPath(),
				gzip: true,
				encoding: null
			}, function (err, response, body) {
				if (err) {
					reject(err);
				}

				if (response.statusCode >= 400) {
					reject('Encountered HTTP error: ' + response.statusMessage);
				}

				resolve(body);
			});
		});
    }
}

module.exports = HttpLoader;
