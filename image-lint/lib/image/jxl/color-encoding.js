/* @flow */

/*::
import type {BitStream, CustomXY} from './bit-stream';
*/

/**
 * Color Space enumeration.
 *
 * @type {Object}
 */
const COLOR_SPACE = {
	K_RGB: 0,
	K_GREY: 1,
	K_XYB: 2,
	K_UNKNOWN: 3,
	K_XYZ: 4
}
const ENUM_COLOR_SPACE = new Set();

ENUM_COLOR_SPACE.add(COLOR_SPACE.K_RGB);
ENUM_COLOR_SPACE.add(COLOR_SPACE.K_GREY);
ENUM_COLOR_SPACE.add(COLOR_SPACE.K_XYB);
ENUM_COLOR_SPACE.add(COLOR_SPACE.K_UNKNOWN);
ENUM_COLOR_SPACE.add(COLOR_SPACE.K_XYZ);

/**
 * White Point enumeration.
 * @type {Object}
 */
const WHITE_POINT = {
	K_D65: 1,
	K_CUSTOM: 2,
	K_E: 10,
	K_DCI: 11
};

const ENUM_WHITE_POINT = new Set();

ENUM_WHITE_POINT.add(WHITE_POINT.K_D65);
ENUM_WHITE_POINT.add(WHITE_POINT.K_CUSTOM);
ENUM_WHITE_POINT.add(WHITE_POINT.K_E);
ENUM_WHITE_POINT.add(WHITE_POINT.K_DCI);

/**
 * Primaries enumeration.
 * @type {Object}
 */
const PRIMARIES = {
	K_SRGB: 1,
	K_CUSTOM: 2,
	K_2100: 9,
	K_P3: 11
}
const ENUM_PRIMARIES = new Set();

ENUM_PRIMARIES.add(PRIMARIES.K_SRGB);
ENUM_PRIMARIES.add(PRIMARIES.K_CUSTOM);
ENUM_PRIMARIES.add(PRIMARIES.K_2100);
ENUM_PRIMARIES.add(PRIMARIES.K_P3);

/**
 * Transfer function enumeration.
 * @type {Object}
 */
const TRANSFER_FUNCTION = {
	K_709: 1,
	K_UNKNOWN: 2,
	K_LINEAR: 8,
	K_SRGB: 13,
	K_PQ: 16,
	K_DCI: 17,
	K_HLG: 18
}
const ENUM_TRANSFER_FUNCTION = new Set();

ENUM_TRANSFER_FUNCTION.add(TRANSFER_FUNCTION.K_709);
ENUM_TRANSFER_FUNCTION.add(TRANSFER_FUNCTION.K_UNKNOWN);
ENUM_TRANSFER_FUNCTION.add(TRANSFER_FUNCTION.K_LINEAR);
ENUM_TRANSFER_FUNCTION.add(TRANSFER_FUNCTION.K_SRGB);
ENUM_TRANSFER_FUNCTION.add(TRANSFER_FUNCTION.K_PQ);
ENUM_TRANSFER_FUNCTION.add(TRANSFER_FUNCTION.K_DCI);
ENUM_TRANSFER_FUNCTION.add(TRANSFER_FUNCTION.K_HLG);


/**
 * Rendering intent enumeration.
 * @type {Object}
 */
const RENDERING_INTENT = {
	K_PERCEPTUAL: 0,
	K_RELATIVE: 1,
	K_SATURATION: 2,
	K_ABSOLUTE: 3
}
const ENUM_RENDERING_INTENT = new Set();

ENUM_RENDERING_INTENT.add(RENDERING_INTENT.K_PERCEPTUAL);
ENUM_RENDERING_INTENT.add(RENDERING_INTENT.K_RELATIVE);
ENUM_RENDERING_INTENT.add(RENDERING_INTENT.K_SATURATION);
ENUM_RENDERING_INTENT.add(RENDERING_INTENT.K_ABSOLUTE);


class ColorEncoding {
	/*::
	received_icc: boolean;
	opaque_icc: boolean;
	color_space: number;
	white_point: number;
	white: CustomXY;
	primaries: number;
	red: CustomXY | null;
	green: CustomXY | null;
	blue: CustomXY | null;
	have_gamma: boolean;
	gamma: number;
	transfer_function: number;
	rendering_intent: number;
	*/
	constructor(stream/*: ?BitStream */) {

		this.received_icc = false;
		this.opaque_icc = false;
		this.color_space = COLOR_SPACE.K_RGB;
		this.white_point = WHITE_POINT.K_D65;
		this.primaries = PRIMARIES.K_SRGB;
		this.have_gamma = false;
		this.gamma = 0;
		this.transfer_function = TRANSFER_FUNCTION.K_SRGB;
		this.rendering_intent = RENDERING_INTENT.K_RELATIVE;

		if (stream) {
			const all_default = stream.read_boolean();

			if (!all_default) {
				this.received_icc = stream.read_boolean();

				if (this.received_icc) {
					this.opaque_icc = stream.read_boolean();
				} else {
					this.opaque_icc = false;
				}

				const use_desc = !all_default && !this.opaque_icc;

				if (use_desc) {
					this.color_space = stream.read_enum(ENUM_COLOR_SPACE);

					const not_xy = this.color_space !== COLOR_SPACE.K_XYB && this.color_space !== COLOR_SPACE.K_XYZ;

					if (not_xy) {
						this.white_point = stream.read_enum(ENUM_WHITE_POINT);

						if (this.white_point === WHITE_POINT.K_CUSTOM) {
							this.white = stream.read_customxy();
						}

						if (this.color_space !== COLOR_SPACE.K_GREY) {
							this.primaries = stream.read_enum(ENUM_PRIMARIES);

							if (this.primaries === PRIMARIES.K_CUSTOM) {
								this.red = stream.read_customxy();
								this.green = stream.read_customxy();
								this.blue = stream.read_customxy();
							}
						}

						this.have_gamma = stream.read_boolean();

						if (this.have_gamma) {
							this.gamma = stream.read_bits(24);
						} else {
							this.transfer_function = stream.read_enum(ENUM_TRANSFER_FUNCTION);
						}

						if (this.color_space !== COLOR_SPACE.K_GREY) {
							this.rendering_intent = stream.read_enum(ENUM_RENDERING_INTENT);
						}
					}
				}
			}
		}
	}
}

module.exports = {
	ColorEncoding,
	COLOR_SPACE
};
