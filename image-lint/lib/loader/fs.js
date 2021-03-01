/* @flow */
const fs = require('fs'),
      Loader = require('../loader');

class FsLoader extends Loader {
    load()/*: Promise<Buffer> */ {
        return new Promise((resolve, reject) => {
            fs.readFile(this.getPath(), (err, buffer) => {
                if (err) {
                    reject(err);
                }

                resolve(buffer);
            });
        });
    }
}

module.exports = FsLoader;
