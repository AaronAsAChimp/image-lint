/* @flow */
'use strict';

import chalk from 'chalk';

/**
 * @typedef {Object} LogCounts
 * @property {number} info The count of the info logs
 * @property {number} warn The count of the warning logs
 * @property {number} error The count of the error logs.
 */

/**
 * @typedef {keyof LogCounts} LogTypes
 */

/**
 * A logger for writing the output to a string.
 */
export class Log {
	/*::
	filename: string;
	log: string;
	count: LogCounts;
	*/

	/**
	 * Construct a new logger, generally you should use the logger factory
	 * instead of directly constructing this object.
	 *
	 * @param  {string | null} filename The name of the file that is being linted.
	 * @param  {Log | null} parent The parent logger.
	 */
	constructor(filename=null/*: string */, parent=null) {
		/**
		 * The name of the associated file if any,
		 * @type {string}
		 */
		this.filename = filename;

		/**
		 * The parent logger if any.
		 * @type {Log | null}
		 */
		this.parent = parent;

		/**
		 * The log messages.
		 * @type {string}
		 */
		this.log = '';

		this._muted = false;

		/**
		 * The log counts by type.
		 * @type {LogCounts}
		 */
		this.count = {
			'info': 0,
			'warn': 0,
			'error': 0,
		};
	}

	/**
	 * Increment the count for the givent type of log.
	 *
	 * @param  {LogTypes} type [description]
	 */
	_increment_count(type) {
		this.count[type]++;

		if (this.parent) {
			this.parent._increment_count(type);
		}
	}

	/**
	 * Determine if this should be printed.
	 * @return {boolean} true if the log should be printed.
	 */
	is_printable()/*: boolean */ {
		return this.count.warn > 0 || this.count.error > 0;
	}

	/**
	 * Stop printing new message to the log.
	 */
	mute() {
		this._muted = true;
	}

	/**
	 * Log a message at the 'info' level.
	 *
	 * @param  {string} message The message to be logged.
	 */
	info(message/*: string */) {
		this._increment_count('info');
		this.log += '\n  INFO:  ' + message;
	}

	/**
	 * Log a message at the 'warn' level.
	 *
	 * @param  {string} message The message to be logged.
	 */
	warn(message/*: string */) {
		this._increment_count('warn');
		this.log += '\n  ' + chalk.yellow('WARN:') + '  ' + message;
	}

	/**
	 * Log a message at the 'error' level.
	 *
	 * @param  {string} message The message to be logged.
	 */
	error(message/*: string */) {
		this._increment_count('error');
		this.log += '\n  ' + chalk.red('ERROR:') + '  ' + message;
	}

	/**
	 * Get the number of errors that have been logged.
	 * @return {number} The number of errors.
	 */
	get_error_count() {
		return this.count.error;
	}

	/**
	 * Get the number of warnings that have been logged.
	 * @return {number} The number of warnings.
	 */
	get_warning_count() {
		return this.count.warn;
	}

	/**
	 * Get a new child logger.
	 * @param  {string} filename The name of the file being linted.
	 * @return {Log}          	 The new logger.
	 */
	get_logger(filename) {
		return new Log(filename, this);
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
export class LoggerFactory {
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

export const ROOT_LOGGER = new Log();
