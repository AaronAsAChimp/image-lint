/* @flow */

const InfoProvider = require('./image-info'),
	  WorkHandler = require('./work-handler'),
	  Hasher = require('./hasher'),
	  pf = require('./pixel-format'),
	  ColorSpace = pf.ColorSpace,
	  LoggerFactory = require('./logger'),
	  EventEmitter = require('events');

/*::
import type { Dimensions } from './image-info';
import type Finder from './finder';
 */

class Linter extends EventEmitter {
	/*::
	finder: Finder;
	 */

	constructor (finder/*: Finder */) {
		super();

		this.finder = finder;

		InfoProvider.load([
			'./image/png-info',
			'./image/gif-info',
			'./image/jpg-info',

			// Identify only
			'./image/bmp-info',
			'./image/psd-info',
			'./image/ico-info',
			'./image/tiff-info',
			'./image/webp-info',
			'./image/svg-info',
			'./image/html-info'
		]);
	}

	calculate_optimial_size(dims/*: Dimensions */, bpp/*: number */) {
		return ((dims.width * dims.height * dims.frames) * bpp);
	}

	describe_file(dims/*: Dimensions */) {
		return 'File properties: ' + dims.width + 'x' + dims.height + (dims.frames !== 1 ? ', ' + dims.frames + ' frames' : '');
	}

	lint(folder/*: string[] */, options/*: any */) {
		var linter = this,
			handler = new WorkHandler(),
			hasher = new Hasher(),
			allowed_color_spaces/*: Set<ColorSpace> | null */ = null;

		// Prepare the allowed color spaces.
		if (options.color_space) {
			let spaces = options.color_space.split(',');

			allowed_color_spaces = new Set();

			for (let space of spaces) {
				space = ColorSpace.from(space);

				if (space) {
					allowed_color_spaces.add(space);
				}
				
			}
		}

		handler.on('next', (file, done) => {
			let logger = LoggerFactory.get_log(file.path);

			function error_handler(err) {
				if (err.stack) {
					logger.error(err.stack);
				} else {
					logger.error(err);
				}

				linter.emit('file.completed', logger);

				done();
			}

			// console.log(file.path);

			file.load()
				.then((file) => {
					// Check for empty files and exit early to prevent unnecessary work.
					if (file.buffer.length === 0) {
						throw 'This is an empty file, further analysis is not possible.';
					}

					if (options.duplicate === true) {
						let found = hasher.contains(file);

						if (found) {
							logger.warn('This file is a duplicate of: ' + found);
						}
					}

					return InfoProvider.get_info(file, logger, options);
				})
				.then((info) => {
					if (!info.truncated) {
						let color_space = info.pixel_format.color_space,
							min_bpp = options.bytes_per_pixel,
							min_savings = options.byte_savings,
							size_difference = info.size - this.calculate_optimial_size(info.dimensions, min_bpp);

						logger.info(this.describe_file(info.dimensions));

						if (info.bytes_per_pixel >= min_bpp && (size_difference > min_savings)) {
							logger.warn('The bytes per pixel (' + info.bytes_per_pixel.toFixed(2) + ') exceeds the minimum (' + min_bpp + ').');
							logger.info('You can acheive a minimum savings of ' + size_difference + ' bytes by meeting this threshold.');
						}

						if (allowed_color_spaces && allowed_color_spaces.size && !allowed_color_spaces.has(color_space)) {
							logger.warn(`The color space of this image is ${ color_space.name }. It must be one of ${ options.color_space }.`);
						}
					} else {
						logger.error('This image is truncated, further analysis is not possible.')
					}

					this.emit('file.completed', logger);

					done();

				}, error_handler)
				.catch(error_handler);
		});

		handler.on('end', () => {
			this.emit('linter.completed');
		});

		handler.start(this.finder.get_files(folder));

		return this;
	}

}

module.exports.default = Linter;

