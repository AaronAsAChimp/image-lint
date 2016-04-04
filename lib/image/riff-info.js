const InfoProvider = require('../image-info.js');
const RIFF_TAG = 0x52494646;

class RIFFInfoProvider extends InfoProvider {
	validate_magic (buffer) {
		var riff_magic = buffer.readUInt32BE(0),
			type_magic = buffer.readUInt32BE(8);

		return riff_magic === RIFF_TAG && type_magic === this.type_tag;
	}
}