/**
 * A class for implementing specialized linting for an image format. This goes
 * above an beyond the general purpose linting provided by the InfoProvider.
 *
 * This class is expected to parse the file once and run multiple lint rules
 * against it.
 *
 * @abstract
 */
export class ImageLinter {
	/**
	 * Run the linter and log all linter errors and warnings to the provided logger.
	 *
	 * @param {Log} logger The logger to write the results to
	 */
	lint(logger) {
		throw new Error('Not Implemented!');
	}
}
