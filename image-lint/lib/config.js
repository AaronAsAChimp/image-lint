import {readFile} from 'fs/promises';
import path from 'path';

const CONFIG_NAME = '.imagelintrc';

/**
 * Find the config file.
 *
 * @param  {string} start_path The path to start looking at.
 *
 * @returns {Buffer | null}    The config file contents.
 */
export async function findConfig(start_path) {
	const current_path = start_path.split(path.sep);
	let current_filename = null;
	let config = null;

	while (current_path.length) {
		current_filename = path.join(...current_path, CONFIG_NAME);

		try {
			config = await readFile(current_filename);
			break;
		} catch {}

		current_path.pop();
	}

	return config;
}

/**
 * Construct a conig from the command line arguments.
 *
 * @param {any} argv The command line arguments.
 * @returns {import('./config').LinterConfig} The new linter configuration
 */
export function configFromArgs(argv) {
	const file_type = argv.file_type ? ['warn', argv.file_type.split(',')] : false;

	return {
		options: {
			'max-warnings': argv.max_warnings,
			'byte-savings': argv.byte_savings,
		},
		rules: {
			'color-space': ['warn', argv.color_space.split(',')],
			'file-type': file_type,
			'duplicate': ['warn', argv.duplicate],
			'bytes-per-pixel': ['warn', argv.bytes_per_pixel],
			'mismatch': ['warn', argv.mismatch],
		},
	};
}
