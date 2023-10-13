#!/usr/bin/env node
'use strict';


import minimist from 'minimist';
import {ArgsHelper} from 'image-lint/lib/args-helper.js';
import {defaults} from 'image-lint/lib/defaults.js';

import {MultiFinder} from 'image-lint/lib/finder/multi.js';
import {ImageIdentifierRegistry} from 'image-lint';

const DEFAULT_DIRECTORY = ['./'];

const argument_config = {
	'boolean': [
	],
	'string': [
	],
	'number': [
	],
	'alias': {
		'help': 'h',
	},
	'default': defaults,
	'-help-usage': 'image-explorer [options] [<files/folders/urls>...]',
	'-help-options': {
	},
};

const argv = minimist(process.argv.slice(2), argument_config);
const EXIT_CODE_OK = 0;

if (ArgsHelper.argv(argument_config, argv)) {
	process.exitCode = EXIT_CODE_OK;
} else {
	let folder = argv._;
	const extensions = ImageIdentifierRegistry.get_all_extensions();
	const mimes = ImageIdentifierRegistry.get_all_mimes();
	const finder = new MultiFinder(extensions, mimes);

	if (!folder.length) {
		folder = DEFAULT_DIRECTORY;
	}

	const files = await finder.get_files(folder);

	for (const file of files()) {
		const ident = ImageIdentifierRegistry.from_file_descriptor(file);
		const buffer = await file.loader.load();

		process.stdout.write(file.path);
		process.stdout.write('\n');

		if (ident.is_of_file_type(buffer)) {
			try {
				ident.debug_print(buffer, process.stdout);
			} catch (e) {
				console.log('Error parsing file\n', e);
			}
		} else {
			console.error('This file is misnamed.');
		}

		process.stdout.write('\n');
	}

	process.exitCode = EXIT_CODE_OK;
}
