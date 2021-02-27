/* @flow */

class Loader {
    /*::
    _path: string;
    */
    constructor(path/*: string */) {
        this._path = path;
    }

    getPath()/*: string */ {
        return this._path;
    }

    load()/*: Promise<Buffer> */ {
        return Promise.reject('Not Implemented!');
    }
}

module.exports = Loader;
