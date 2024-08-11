const MINIMUM_BYTES_PER_PIXEL = 3;
const MINIMUM_BYTE_SAVINGS = 500;
const DEFAULT_COLOR_SPACES = 'G,RGB';

export const defaults = {
	'bytes_per_pixel': MINIMUM_BYTES_PER_PIXEL,
	'byte_savings': MINIMUM_BYTE_SAVINGS,
	'color_space': DEFAULT_COLOR_SPACES,
	'mismatch': true,
	'duplicate': true,
	'max_warnings': -1,
};

/**
 * Convert the command line arguments to config objects
 *
 * @param  {typeof defaults} input The args
 *
 * @returns {import("./linter").LinterOptions}      The config
 */
export function to_config(input) {
	/** @type {import("./linter").LinterOptions} */
	const config = {
		...input,
		color_space: input.color_space.split(','),
		file_type: null,
	};

	if (input.file_type) {
		config.file_type = input.file_type.split(',');
	}

	return config;
}
