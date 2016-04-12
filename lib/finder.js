'use strict';

const EventEmitter = require('events');

class Finder {
	constructor(extensions, mimes) {
		this.extensions = extensions;
		this.mimes = mimes;
		this._files = [];
	}

	load () {
		throw new Error('Not Implemented');
	}

	get_files() {
		throw new Error('Not Implemented');
	}

	is_image_extension(ext) {
		return this.extensions.indexOf(ext) >= 0;
	}

	is_image_mime(mime) {
		return this.mimes.indexOf(mime) >= 0;
	}
}

module.exports = Finder;
