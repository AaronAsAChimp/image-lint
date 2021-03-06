#!/usr/bin/env node
/* @flow */
'use strict';

const ArgsHelper = require('image-lint').ArgsHelper,
	  chalk = require('chalk'),
	  minimist = require('minimist'),
	  http = require('http');

var argument_config = {
	'boolean': [
		'help',
		'version'
	],
	'string': [
	],
	'alias': {
	},
	'default': {
		'host': '0.0.0.0',
		'port': 8080
	},
	'-help-usage': 'image-lint-server [options]',
	'-help-options': {
		'host': 'The host name or IP address to serve the API on.',
		'port': 'The port to serve the API on.',
		'help': 'Print this message, then exit.',
		'version': 'Print the version number and exit.'
	}
};

var argv = minimist(process.argv.slice(2), argument_config);

if (ArgsHelper.argv(argument_config, argv)) {
	process.exitCode = 0;
} else {
	const Koa = require('koa');
	const app = new Koa();
	const serve = require('koa-static');
	const busboy = require('async-busboy');
	const path = require('path');
	const router = require('koa-router')(),
		  InfoProvider = require('image-lint').InfoProvider,
		  BufferArrayFinder = require('image-lint').BufferArrayFinder,
		  Linter = require('image-lint').Linter;

	chalk.level = 0;

	console.log(BufferArrayFinder);

	let finder = new BufferArrayFinder(InfoProvider.get_all_extensions(), InfoProvider.get_all_mimes());

	router.post('/api/image/check/', async function (ctx) {
		let files = [],
			fields = {},
			results = null,
			linter = new Linter(finder);

		try {
			({files, fields} = await busboy(ctx.req));
		} catch (e) {
			console.log(e.stack || e.message || e);
		}

		fields.mismatch = fields.mismatch === 'true';
		fields.duplicate = fields.duplicate === 'true';

		results = await (new Promise((resolve, reject) => {
			let result_list = [];

			linter.lint(files, fields)
				.on('file.completed', (logger) => {
					result_list.push(logger);
				})
				.on('linter.completed', () => {
					resolve(result_list);
				});
		}));

		// => POST body
		ctx.body = {
			files: files.length,
			fields: fields,
			results: results
		};
	});

	app.use(router.routes())
		.use(serve(path.join(__dirname, '../web/')))
		.listen(8080, function () {
			console.log('koa server start listening on port 8080');
		});
}
