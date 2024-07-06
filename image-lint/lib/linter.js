/* @flow */

import {WorkHandler} from './work-handler.js';
import {Hasher} from './hasher.js';
import {ColorSpace} from './pixel-format.js';
import {ROOT_LOGGER} from './logger.js';
import {EventEmitter} from 'events';
import {ImageIdentifierRegistry} from './ident-registry.js';

/*::
import type { Dimensions, ImageInfo } from './image-info';
import type Finder from './finder';
import type {FileDescriptor} from './finder';
import type {Log} from './logger';
 */

/**
 * @typedef {Object} LinterOptions
 * @property {string[]} color_space
 * @property {string[]} file_type
 * @property {boolean} duplicate
 * @property {number} bytes_per_pixel
 * @property {number} byte_savings
 * @property {boolean} mismatch
 * @property {boolean} help
 * @property {boolean} version
 */

/**
 * @typedef {import('./ident.js').ImageIdentifier} ImageIdentifier
 */


/**
 * An unavoidable linter error that prevents the linter from continuing. This
 * is mainly marker class so we don't have to print the stack trace.
 */
class LinterError extends Error {

}

/**
 * The image linter.
 */
export class Linter extends EventEmitter {
	/*::
	finder: Finder;
	disable_color: boolean;
	 */

	/**
	 * Construct a new Linter
	 * @param  {Finder} finder The finder to use to locate the images.
	 */
	constructor(finder/*: Finder */) {
		super();

		this.finder = finder;
		this.disable_color = false;
	}

	/**
	 * Calculate the optimal size of the image.
	 *
	 * @param  {Dimensions} dims   The dimensions of the image.
	 * @param  {number}     bpp    The bytes per pixel of the image.
	 * @return {number}            The optimial size of the image.
	 */
	calculate_optimial_size(dims/*: Dimensions */, bpp/*: number */)/*: number */ {
		return ((dims.width * dims.height * dims.frames) * bpp);
	}

	/**
	 * Construct a description of an image file.
	 *
	 * @param  {Dimensions} dims    The dimensions of the image.
	 * @return {string}             The description of the image.
	 */
	describe_file(dims/*: Dimensions */)/*: string */ {
		return 'File properties: ' + dims.width + 'x' + dims.height + (dims.frames !== 1 ? ', ' + dims.frames + ' frames' : '');
	}

	/**
	 * Get the information for the file.
	 *
	 * @param  {FileDescriptor} file    The file descriptor.
	 * @param  {Buffer} buffer          The file buffer.
	 * @param  {Log} logger             The logger for printing errors.
	 * @param  {LinterOptions} options  The options for the linter.
	 * @return {Promise<ImageIdentifier>}     The image info.
	 */
	get_identifier(
		file/*: FileDescriptor */,
		buffer/*: Buffer */,
		logger/*: Log */,
		options/*: LinterOptions */)/*: Promise<ImageInfo> */ {
		return new Promise((resolve, reject) => {
			const extension = file.extension.toLowerCase();
			let identifier = ImageIdentifierRegistry.from_extension(extension);
			let file_buffer/*: ?Buffer */ = null;
			let is_of_file_type = false;

			if (buffer instanceof Buffer) {
				file_buffer = buffer;
			} else {
				reject(new LinterError('Image buffer is missing, this is a bug.'));
				return;
			}

			if (identifier) {
				is_of_file_type = identifier.is_of_file_type(file_buffer);
			} else {
				logger.warn('There is no information provider for "' + extension + '" files.');
			}

			// Attenpt to find the correct file type.
			if (!identifier || !is_of_file_type) {
				if (options.mismatch === true) {
					logger.info('This file is not what it seems, attempting brute force discovery of file type.');
				} else {
					logger.info('This file is not what it seems.');
				}

				identifier = null;

				for (const candidate of ImageIdentifierRegistry.all_providers()) {
					if (candidate.can_validate(file_buffer) && candidate.is_of_file_type(file_buffer)) {
						identifier = candidate;
					}
				}
			}

			if (!is_of_file_type) {
				let found_extension = 'unknown';

				if (identifier) {
					found_extension = identifier.get_extension();
				}

				if (options.mismatch === true) {
					logger.warn('There is a mismatch between the file extension (' + extension + ') and the file contents (' + found_extension + ')');
				}
			}

			if (identifier) {
				resolve(identifier);
			} else {
				reject(new LinterError('Unknown file type'));
			}
		});
	}

	/**
	 * Get the information for the file.
	 *
	 * @param  {ImageIdentifier} identifier  The file identifier.
	 * @param  {Buffer} buffer          The file buffer.
	 * @param  {Log} logger             The logger for printing errors.
	 * @return {ImageInfo}     The image info.
	 */
	get_info(
		identifier,
		buffer/*: Buffer */)/*: Promise<ImageInfo> */ {
		const ProviderClass = identifier.get_info_provider();
		let image_info;

		if (ProviderClass) {
			const provider = new ProviderClass();

			image_info = provider.get_info(buffer);
		} else {
			throw new LinterError('Unsupported file type');
		}

		return image_info;
	}

	/**
	 * Run the linter
	 * @param  {string[]} folder        A list of folders to look for images in.
	 * @param  {LinterOptions} options  The options for the linter.
	 * @return {Linter}                 The linter for chaining.
	 */
	lint(folder/*: string[] */, options/*: LinterOptions */)/*: Linter */ {
		const handler = new WorkHandler();
		const hasher = new Hasher();

		/** @type {Set<ColorSpace> | null } */
		let allowed_color_spaces = null;

		// Prepare the allowed color spaces.
		if (options.color_space) {
			const spaces = options.color_space;

			allowed_color_spaces = new Set();

			for (let space of spaces) {
				space = ColorSpace.from(space);

				if (space) {
					allowed_color_spaces.add(space);
				}
			}
		}

		/** @type {Set<string> | null } */
		let allowed_file_types = null;

		if (options.file_type) {
			allowed_file_types = new Set();

			for (const file_type of options.file_type) {
				const normalized_type = ImageIdentifierRegistry.normalize_extension(file_type);

				if (normalized_type) {
					allowed_file_types.add(normalized_type);
				}
			}
		}

		handler.on('next', async (file/*: FileDescriptor */, done/*: () => void */) => {
			const logger = ROOT_LOGGER.get_logger(file.path);

			// console.log(file.path);

			try {
				const buffer = await file.loader.load();
				// A file could still be loading when a fatal error occurs
				// so check the status of the handler before continuing.
				if (handler.is_stopped()) {
					done();
					return;
				}

				// Check for empty files and exit early to prevent unnecessary work.
				if (buffer.length === 0) {
					throw new LinterError('This is an empty file, further analysis is not possible.');
				}

				if (options.duplicate === true) {
					const found = hasher.contains(file.path, buffer);

					if (found) {
						logger.warn('This file is a duplicate of: ' + found);
					}
				}

				const identifier = await this.get_identifier(file, buffer, logger, options);

				const info = await this.get_info(identifier, buffer);

				// We could still be parsing a file when a fatal error
				// occurs so check the status of the handler before continuing.
				if (handler.is_stopped()) {
					done();
					return;
				}

				if (!info.truncated) {
					const color_space = info.pixel_format.color_space;
					const min_bpp = options.bytes_per_pixel;
					const min_savings = options.byte_savings;
					const size_difference = info.size - this.calculate_optimial_size(info.dimensions, min_bpp);

					logger.info(this.describe_file(info.dimensions));

					if (info.bytes_per_pixel >= min_bpp && (size_difference > min_savings)) {
						logger.warn('The bytes per pixel (' + info.bytes_per_pixel.toFixed(2) + ') exceeds the minimum (' + min_bpp + ').');
						logger.info('You can acheive a minimum savings of ' + size_difference + ' bytes by meeting this threshold.');
					}

					if (allowed_file_types && !allowed_file_types.has(identifier.get_extension())) {
						logger.warn(`The file type of the image is ${ identifier.get_extension() }. It must be one of ${ Array.from(allowed_file_types).join(', ') }.`);
					}

					if (allowed_color_spaces) {
						if (color_space.name === 'UNK') {
							const channels = color_space.channels > 0 ? color_space.channels : 'an unknown number of';

							logger.error(`This image has an unknown color space ${ color_space.getUnkFormat() } with ${ channels } channels.`);
						} else if (allowed_color_spaces.size && !allowed_color_spaces.has(color_space)) {
							// console.log('Color Space', color_space);
							logger.warn(`The color space of this image is ${ color_space.name }. It must be one of ${ options.color_space }.`);
						}
					}

					const linter = identifier.get_linter(buffer);

					// Handle specialized linting logic for this type of file
					if (linter) {
						// console.log(file.path);
						linter.lint(logger);
					}
				} else {
					logger.error('This image is truncated, further analysis is not possible.');
				}
			} catch (err) {
				if (err instanceof LinterError) {
					// A there was a problem with the file that prevents linting
					// from continuing.
					logger.error(err.message);
				} else if (err.stack) {
					logger.error(err.message + ': ' + err.stack);
				} else {
					logger.error(err);
				}
			} finally {
				if (options.max_warnings >= 0 && ROOT_LOGGER.get_warning_count() > options.max_warnings) {
					if (!handler.is_stopped()) {
						logger.error(`Too many warnings. A maximum of ${options.max_warnings} warnings are allowed.`);
						handler.stop();
					}
				}

				this.emit('file.completed', logger);

				done();
			}
		});

		handler.on('end', () => {
			this.emit('linter.completed');
		});

		handler.start(this.finder.get_files(folder));

		return this;
	}
}
