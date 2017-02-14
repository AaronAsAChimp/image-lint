/* @flow */
'use strict';

const chalk = require('chalk');

/*::
interface LogCounts {
	info: number;
	warn: number;
	error: number;
}
*/

class Log {
	/*::
	filename: string;
	log: string;
	count: LogCounts;
	*/

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
		this.log += chalk.yellow('\n  WARN:  ') + message;
	}

	error (message) {
		this.count.error++;
		this.log += chalk.red('\n  ERROR: ') + message;
	}

	toString () {
		let warn_count = this.count.warn.toString(),
			error_count = this.count.error.toString();

		if (this.count.warn) {
			warn_count = chalk.yellow(warn_count);
		}

		if (this.count.error) {
			error_count = chalk.red(error_count);
		}

		return this.filename + this.log + '\n' +
			warn_count + ' warnings. ' +
			error_count + ' errors.';
	}
}

class LoggerFactory {

	static
	get_log(filename) {
		return new Log(filename);
	}
}

module.exports = LoggerFactory;