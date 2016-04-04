'use strict';

class Log {

	constructor (filename) {
		this.filename = filename;
		this.log = '';
		this.count = {
			'info': 0,
			'warn': 0,
			'error': 0
		};
	}

	is_printable () {
		return this.count.warn || this.count.error;
	}

	info (message) {
		this.count.info++;
		this.log += '\n  INFO:  ' + message;
	}

	warn (message) {
		this.count.warn++;
		this.log += '\n  WARN:  ' + message;
	}

	error (message) {
		this.count.error++;
		this.log += '\n  ERROR: ' + message;
	}

	toString () {
		return this.filename + this.log + '\n' +
			this.count.warn + ' warnings. ' +
			this.count.error + ' errors.';
	}
}

class LoggerFactory {

	static
	get_log(filename) {
		return new Log(filename);
	}
}

module.exports = LoggerFactory;