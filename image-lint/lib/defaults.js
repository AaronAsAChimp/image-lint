const MINIMUM_BYTES_PER_PIXEL = 3;
const MINIMUM_BYTE_SAVINGS = 500;
const DEFAULT_COLOR_SPACES = 'G,RGB';

module.exports = {
	default: {
		'bytes_per_pixel': MINIMUM_BYTES_PER_PIXEL,
		'byte_savings': MINIMUM_BYTE_SAVINGS,
		'color_space': DEFAULT_COLOR_SPACES,
		'mismatch': true,
		'duplicate': true,
	},
};
