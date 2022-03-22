#!/usr/bin/env node
/* @flow */
'use strict';

/*::
import type {ExtendedOptions} from '../lib/args-helper.js';
*/

const minimist = require('minimist'),
	  ArgsHelper = require('../lib/args-helper').default,
	  linter = require('../lib/linter'),
	  Linter = linter.default,
	  MINIMUM_BYTES_PER_PIXEL = 3,
	  MINIMUM_BYTE_SAVINGS = 500,
	  DEFAULT_COLOR_SPACES = 'G,RGB',
	  DEFAULT_DIRECTORY = ['./'];

var argument_config/*: minimistOptions */ = {
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
	'default': {
		'bytes_per_pixel': MINIMUM_BYTES_PER_PIXEL,
		'byte_savings': MINIMUM_BYTE_SAVINGS,
		'color_space': DEFAULT_COLOR_SPACES,
		'mismatch': true,
		'duplicate': true
	},
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

var argv = minimist(process.argv.slice(2), argument_config);

if (ArgsHelper.argv(argument_config, argv)) {
	process.exitCode = 0;
} else {
	const MultiFinder = require('../lib/finder/multi');
	const ImageIdentifier = require('../lib/ident');

	let folder = argv._;
	const finder = new MultiFinder(ImageIdentifier.get_all_extensions(), ImageIdentifier.get_all_mimes());
	const cli_linter = new Linter(finder);

	if (!folder.length) {
		folder = DEFAULT_DIRECTORY;
	}

	argv.color_space = argv.color_space.split(',');

	cli_linter.lint(folder, argv)
		.on('file.completed', (logger) => {
			if (logger.is_printable()) {
				console.log(logger.toString());
			}
		});
}
