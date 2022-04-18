#!/usr/bin/env node
/* @flow */
'use strict';

/*::
import type {ExtendedOptions} from '../lib/args-helper.js';
*/

const minimist = require('minimist'),
	  chalk = require('chalk'),
	  ArgsHelper = require('../lib/args-helper').default,
	  linter = require('../lib/linter'),
	  defaults = require('../lib/defaults').default,
	  Linter = linter.default,
	  DEFAULT_DIRECTORY = ['./'];

const argument_config/*: minimistOptions */ = {
	'boolean': [
		'mismatch',
		'duplicate',
		'help',
		'version'
	],
	'string': [
		'color_space'
	],
	'alias': {
		'bytes_per_pixel': 'b',
		'byte_savings': 's',
		'help': 'h',
		'version': 'v'
	},
	'default': defaults,
	'-help-usage': 'image-lint [options] [<files/folders/urls>...]',
	'-help-options': {
		'mismatch': 'Find mismatches between file type and file extension.',
		'duplicate': 'Find files that have been copied.',
		'bytes_per_pixel': 'Set the maximum bytes per pixel before giving a warning.',
		'byte_savings': 'Set the minimum byte savings before giving a warning.',
		'color_space': 'Set the allowed color spaces separated by a comma',
		'help': 'Print this message, then exit.',
		'version': 'Print the version number and exit.'
	}
};

const argv = minimist(process.argv.slice(2), argument_config);

const EXIT_CODE_OK = 0;
const EXIT_CODE_LINT_ERROR = 1;

if (ArgsHelper.argv(argument_config, argv)) {
	process.exitCode = EXIT_CODE_OK;
} else {
	const MultiFinder = require('../lib/finder/multi');
	const ImageIdentifier = require('../lib/ident');

	let folder = argv._;
	let error_count = 0;
	let warning_count = 0;
	const finder = new MultiFinder(ImageIdentifier.get_all_extensions(), ImageIdentifier.get_all_mimes());
	const cli_linter = new Linter(finder);

	if (!folder.length) {
		folder = DEFAULT_DIRECTORY;
	}

	argv.color_space = argv.color_space.split(',');

	cli_linter.lint(folder, argv)
		.on('file.completed', (logger) => {
			error_count += logger.get_error_count();
			warning_count += logger.get_warning_count();

			if (logger.is_printable()) {
				console.log(logger.toString());
			}
		})
		.on('linter.completed', () => {
			const has_errors = (error_count > 0 || warning_count > 0);
			const warnings = warning_count > 0 ? chalk.yellow(warning_count) : warning_count;
			const errors = error_count > 0 ? chalk.red(error_count) : error_count;

			if (has_errors) {
				console.log(`\nTotal Warnings: ${ warnings }, Errors: ${ errors }`);
			}

			process.exitCode = has_errors ? EXIT_CODE_LINT_ERROR : EXIT_CODE_OK;
		});
}
