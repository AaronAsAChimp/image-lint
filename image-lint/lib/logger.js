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

	constructor (filename/*: string */) {
		this.filename = filename;
		this.log = '';
		this.count = {
			'info': 0,
			'warn': 0,
			'error': 0
		};
	}

	is_printable ()/*: boolean */ {
		return this.count.warn > 0 || this.count.error > 0;
	}

	info (message/*: string */) {
		this.count.info++;
		this.log += '\n  INFO:  ' + message;
	}

	warn (message/*: string */) {
		this.count.warn++;
		this.log += '\n  ' + chalk.yellow('WARN:') + '  ' + message;
	}

	error (message/*: string */) {
		this.count.error++;
		this.log += '\n  ' + chalk.red('ERROR:') + '  ' + message;
	}

	toString ()/*: string */ {
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
	get_log(filename/*: string */)/*: Log */ {
		return new Log(filename);
	}
}

exports.LoggerFactory = LoggerFactory;
exports.Log = Log;
