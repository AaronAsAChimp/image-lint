'use strict';

const InfoProvider = require('../image-info.js'),
	  FIRST_BYTE = 0,
	  ICO_MAGIC = 1,
	  CUR_MAGIC = 2,
	  MINIMUM_SIZE = 4; // 4 == size of FIRST_BYTE + size of *_MAGIC

class IcoInfoProvider extends InfoProvider {
	can_validate (buffer) {
		return buffer.length > MINIMUM_SIZE;
	}

	validate_magic (buffer) {
		// ico: 0000 0001
		// cur: 0000 0002
		var first_magic = buffer.readUInt16LE(0),
			type_magic = buffer.readUInt16LE(2);

		return first_magic === FIRST_BYTE && (type_magic === ICO_MAGIC || type_magic === CUR_MAGIC);
	}

	identify_only () {
		return true;
	}

	get_extensions() {
		return [
			'.ico',
			'.cur'
		];
	}

	get_mimes() {
		return [
			'image/x-icon'
		];
	}
}

InfoProvider.register(IcoInfoProvider);
