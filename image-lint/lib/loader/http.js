/* @flow */
const got = require('got'),
      Loader = require('../loader');

class HttpLoader extends Loader {
    async load()/*: Promise<Buffer> */ {
        const response = await got(this.getPath(), {
            responseType: 'buffer'
        });

        return response.body;
    }
}

module.exports = HttpLoader;
