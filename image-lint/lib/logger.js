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

/**
 * A logger for writing the output to a string.
 */
class Log {
	/*::
	filename: string;
	log: string;
	count: LogCounts;
	*/

	/**
	 * Construct a new logger, generally you should use the logger factory
	 * instead of directly constructing this object.
	 *
	 * @param  {string} filename The name of the file that is being linted.
	 */
	constructor(filename/*: string */) {
		this.filename = filename;
		this.log = '';
		this.count = {
			'info': 0,
			'warn': 0,
			'error': 0,
		};
	}

	/**
	 * Determine if this should be printed.
	 * @return {boolean} true if the log should be printed.
	 */
	is_printable()/*: boolean */ {
		return this.count.warn > 0 || this.count.error > 0;
	}

	/**
	 * Log a message at the 'info' level.
	 *
	 * @param  {string} message The message to be logged.
	 */
	info(message/*: string */) {
		this.count.info++;
		this.log += '\n  INFO:  ' + message;
	}

	/**
	 * Log a message at the 'warn' level.
	 *
	 * @param  {string} message The message to be logged.
	 */
	warn(message/*: string */) {
		this.count.warn++;
		this.log += '\n  ' + chalk.yellow('WARN:') + '  ' + message;
	}

	/**
	 * Log a message at the 'error' level.
	 *
	 * @param  {string} message The message to be logged.
	 */
	error(message/*: string */) {
		this.count.error++;
		this.log += '\n  ' + chalk.red('ERROR:') + '  ' + message;
	}

	/**
	 * Convert this log to a string.
	 * @return {string} The log output.
	 */
	toString()/*: string */ {
		let warn_count = this.count.warn.toString();
		let error_count = this.count.error.toString();

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

/**
 * A factory for creating new logs.
 */
class LoggerFactory {
	/**
	 * Get a new instance of a logger.
	 *
	 * @param {string} filename The filename of the file being linted.
	 * @return {Log}            The new logging instance.
	 */
	static get_log(filename/*: string */)/*: Log */ {
		return new Log(filename);
	}
}

exports.LoggerFactory = LoggerFactory;
exports.Log = Log;
