type LinterRule<T> = false | ['warn' | 'error', T];

export interface LinterConfig {
	options: {
		'max-warnings': number,
		'byte-savings': number,
	},
	rules: {
		'color-space': LinterRule<string[]>,
		'file-type': LinterRule<string[]>,
		'duplicate': LinterRule<void>,
		'bytes-per-pixel': LinterRule<number>,
		'mismatch': LinterRule<void>,
	},
}
