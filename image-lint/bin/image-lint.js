#!/usr/bin/env node

import minimist from 'minimist';
import chalk from 'chalk';
import {ArgsHelper} from '../lib/args-helper.js';
import {Linter} from '../lib/linter.js';
import {defaults} from '../lib/defaults.js';

import {MultiFinder} from '../lib/finder/multi.js';
import {ImageIdentifierRegistry} from '../lib/ident-registry.js';

const DEFAULT_DIRECTORY = ['./'];

/** @type { import('minimist').Opts & ArgsHelperOpts } */
const argument_config = {
	'boolean': [
		'mismatch',
		'duplicate',
		'help',
		'version',
	],
	'string': [
		'color_space',
		'file_type',
	],
	'number': [
		'max_warnings',
	],
	'alias': {
		'bytes_per_pixel': 'b',
		'byte_savings': 's',
		'help': 'h',
		'version': 'v',
	},
	'default': defaults,
	'-help-usage': 'image-lint [options] [<files/folders/urls>...]',
	'-help-options': {
		'mismatch': 'Find mismatches between file type and file extension.',
		'duplicate': 'Find files that have been copied.',
		'bytes_per_pixel': 'Set the maximum bytes per pixel before giving a warning.',
		'byte_savings': 'Set the minimum byte savings before giving a warning.',
		'color_space': 'Set the allowed color spaces separated by a comma.',
		'file_type': 'Set the allowed file types separated by a comma.',
		'max_warnings': 'Set the maximum number of warnings allowed.',
		'help': 'Print this message, then exit.',
		'version': 'Print the version number and exit.',
	},
};

const argv = minimist(process.argv.slice(2), argument_config);

const EXIT_CODE_OK = 0;
const EXIT_CODE_LINT_ERROR = 1;

if (ArgsHelper.argv(argument_config, argv)) {
	process.exitCode = EXIT_CODE_OK;
} else {
	let folder = argv._;
	let error_count = 0;
	let warning_count = 0;
	const finder = new MultiFinder(
		ImageIdentifierRegistry.get_all_extensions(),
		ImageIdentifierRegistry.get_all_mimes(),
	);
	const cli_linter = new Linter(finder);

	if (!folder.length) {
		folder = DEFAULT_DIRECTORY;
	}

	argv.color_space = argv.color_space.split(',');

	if (argv.file_type) {
		argv.file_type = argv.file_type.split(',');
	}

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
