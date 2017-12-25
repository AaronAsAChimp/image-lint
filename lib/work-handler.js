'use strict';

const EventEmitter = require('events');

//const MAX_ACTIVE_HANDLERS = 1;
const MAX_ACTIVE_HANDLERS = 10;

class WorkHandler extends EventEmitter {

	constructor() {
		super();

		var finder = this;

		this._active_handlers = 0;
		this._active_processes = 0;
		this._done_proxy = this._done.bind(this);
		this._iterator = null;

		this.on('handler.available', this._handler_available.bind(this));
	}

	_handler_available() {
		if (this._iterator) {
			var next = this._iterator.next();

			if (next.done) {
				this._iterator = null;
			} else {
				this.emit('next', next.value, this._done_proxy);
				this._active_handlers++;
				this._active_processes++;
			}
		}
	}

	_done() {
		this._active_handlers--;
		this._active_processes--;

		// console.log('handlers', this._active_handlers);
		// console.log('processes', this._active_processes);

		if (this._active_handlers >= 0) {
			this.emit('handler.available');
		} else {
			throw new Error('No handlers available, did you call done?');
		}

		if (this._active_processes <= 0) {
			this.emit('end');
		}
	}

	start(promise) {
		if (this._iterator) {
			throw new Error('Work is in progress');
		}

		let handler = this;

		this._active_handlers = 0;

		promise
			.then((iterator) => {
				this._iterator = iterator();

				while (this._active_handlers < MAX_ACTIVE_HANDLERS) {
					this.emit('handler.available');
					this._active_handlers++;
				}
			}, (e) => {
				if (e.stack) {
					console.error('Error', e.stack);
				} else {
					console.error('Error', e);
				}
			})
			.catch((e) => {
				if (e.stack) {
					console.error('Error', e.stack);
				} else {
					console.error('Error', e);
				}
			});
	}
}

module.exports = WorkHandler;
