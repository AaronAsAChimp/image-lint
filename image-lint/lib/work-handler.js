/* @flow */
'use strict';

import {EventEmitter} from 'events';

// const MAX_ACTIVE_HANDLERS = 1;
const MAX_ACTIVE_HANDLERS = 10;

/**
 * Manage workloads so the async queue doesn't get filled before any work can
 * be done. An iterable is provided to the the start method each item will be
 * emitted for processing with the 'next' event.
 *
 * The 'next' event handler will be provided two parameter, the next item in the
 * iterable and a 'done' function to be called to release the work handler back
 * to the pool.
 */
export class WorkHandler /*:: <T> */ extends EventEmitter {
	/*::
	_active_handlers: number;
	_active_processes: number;
	_done_proxy: () => void;
	_iterator: Iterator<T> | null;
	*/

	/**
	 * Construct a new WorkHandler
	 */
	constructor() {
		super();

		this._active_handlers = 0;
		this._active_processes = 0;
		this._done_proxy = this._done.bind(this);
		this._iterator = null;
		this._stopped = false;

		this.on('handler.available', this._handler_available.bind(this));
	}

	/**
	 * Kick off the next element in the iterable.
	 */
	_handler_available() {
		if (this._iterator) {
			const next = this._iterator.next();

			if (next.done) {
				this._iterator = null;
			} else {
				this.emit('next', next.value, this._done_proxy);
				this._active_handlers++;
				this._active_processes++;
			}
		}
	}

	/**
	 * Release the work handler to the pool.
	 */
	_done() {
		this._active_handlers--;
		this._active_processes--;

		// console.log('handlers', this._active_handlers);
		// console.log('processes', this._active_processes);

		if (!this._stopped) {
			if (this._active_handlers >= 0 && !this._stopped) {
				this.emit('handler.available');
			} else {
				throw new Error('No handlers available, did you call done?');
			}
		}

		if (this._active_processes <= 0) {
			this.emit('end');
		}
	}

	/**
	 * Determine if the work handler is stopped.
	 * @return {boolean} true if the work handler is stopped.
	 */
	is_stopped() {
		return this._stopped;
	}

	/**
	 * Start the work handler.
	 * @param  {Promise<Iterable<T>>} promise An iterable of items that will
	 *                                        be processed.
	 */
	start(promise/*: Promise<Iterable<T>> */) {
		if (this._iterator) {
			throw new Error('Work is in progress');
		}

		this._active_handlers = 0;

		promise
			.then((iterator) => {
				this._iterator = iterator();

				while (this._active_handlers < MAX_ACTIVE_HANDLERS) {
					this.emit('handler.available');
					this._active_handlers++;
				}
			}, (e/*: Error */) => {
				if (e.stack) {
					console.error(`${ e.name }: ${ e.message } \n`, e);
				} else {
					console.error('Error', e);
				}
			})
			.catch((e/*: Error */) => {
				if (e.stack) {
					console.error(`${ e.name }: ${ e.message } \n`, e);
				} else {
					console.error('Error', e);
				}
			});
	}

	/**
	 * Stop the work handler before it has reached the end of the iterator. Any
	 * currently running processes will be allowed to complete, but no new
	 * proesses will be started.
	 */
	stop() {
		this._stopped = true;
	}
}
