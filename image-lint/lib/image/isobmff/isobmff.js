// This is what I percieve to be the ISOBMFF format. This is reverse engineered
// from several files of different types.

const MAX_BLOCKS = 2048;


// Root Block Tags
//
// MP4
// ---
// ftyp
// free
// mdat
// moov
//
// AVIF
// ----
// ftyp
// meta
// mdat
//
// HEIC
// ----
// ftyp
// meta
// mdat


/** @typedef {ISOBMFFAtom | ISOBMFFBlock} BlockOrAtom */

/**
 * This is a block read from an ISOBMFF encoded file.
 */
export class ISOBMFFAtom {
	/**
	 * Construct a new ISOBMFFBlock.
	 *
	 * @param  {number} length   The length of the block.
	 * @param  {string} tag      The block tag.
	 */
	constructor(length, tag) {
		this.length = length;
		this.tag = tag;
	}

	/**
	 * Describe this atom.
	 *
	 * @param {string} indent The indent to add to this description.
	 * @returns {string} The description of this atom.
	 */
	describe(indent='') {
		return `${ indent } ${ this.tag } (length ${ this.length })\n`;
	}

	/**
	 * Read a block from a buffer.
	 *
	 * @param  {Buffer} buffer  The buffer object to read from.
	 * @param  {number} offset  The offset to the beginning of the block.
	 * @returns {ISOBMFFAtom}   The block that was read.
	 */
	static read(buffer, offset) {
		let block;
		const length = buffer.readUInt32BE(offset);

		if (length) {
			const tag = buffer.toString('ascii', offset + 4, offset + 8);
			const content = buffer.subarray(offset + 8, offset + length);

			if (tag in BLOCK_TYPES) {
				block = new BLOCK_TYPES[tag](length, tag, content);
			} else {
				block = new UnknownAtom(length, tag, content);
			}
		} else {
			block = new NullAtom();
		}

		return block;
	}
}

/**
 * A ISO BMFF Atom that can contains other Blocks or Atoms.
 */
class ISOBMFFBlock extends ISOBMFFAtom {
	/** @type {Record<string, BlockOrAtom>} */
	_children;

	/**
	 * Construct a new ISOBMFF block
	 *
	 * @param  {number} length  The length of the block.
	 * @param  {string} tag     The tag.
	 * @param  {Buffer} buffer  The content of the block.
	 * @param  {number} offset  The offset to the beginning of the container.
	 */
	constructor(length, tag, buffer, offset = 0) {
		super(length, tag);

		this._buffer = buffer;
		this._offset = offset;
		this._children = null;
	}

	/**
	 * Lazy load the children.
	 *
	 * @returns {Record<string, BlockOrAtom>} The children of this block.
	 */
	get children() {
		const buffer = this._buffer;
		const offset = this._offset;

		if (!this._children) {
			this._children = {};

			for (const block of this.readBlocks(buffer, offset)) {
				// Only take the first block for a particular tag to prevent
				// appending data to overwrite content in the file. Which might be
				// a security issue.
				//
				// Also skip null blocks.
				if (block.tag !== null && !this._children[block.tag]) {
					this._children[block.tag] = block;
				}
			}
		}

		return this._children;
	}

	/**
	 * Read all of the blocks from this buffer starting at offset.
	 *
	 * @param  {Buffer} buffer The buffer object to read from
	 * @param  {number} offset The offset to start reading from.
	 * @yields {ISOBMFFBlock} for each block in the buffer.
	 */
	* readBlocks(buffer, offset) {
		let bytesProcessed = 0;
		let blocksTillMax = MAX_BLOCKS;

		while (bytesProcessed + offset < buffer.length && blocksTillMax) {
			const block = ISOBMFFAtom.read(buffer, offset + bytesProcessed);
			bytesProcessed += block.length;
			blocksTillMax--;

			yield block;
		}
	}

	/**
	 * Describe this block.
	 *
	 * @param {string} indent The indent to add to this description.
	 * @returns {string} The description of this block.
	 */
	describe(indent='') {
		const desc = super.describe(indent);
		const children = this.children;
		let children_desc = '';

		if (children) {
			for (const child of Object.values(children)) {
				children_desc += child.describe(indent + '    ');
			}
		}

		return desc + children_desc;
	}
}

/**
 * A ISO BMFF block for an unidentified block.
 */
class UnknownAtom extends ISOBMFFAtom {
	/**
	 * Construct a new Unknown block.
	 *
	 * @param  {number} length   The length of the block.
	 * @param  {string} tag      The block tag.
	 * @param  {Buffer} content  The content of the block.
	 */
	constructor(length, tag, content) {
		super(length, tag);

		this.content = content;
	}
}

/**
 * A null atom for atoms that have zero length.
 */
class NullAtom extends ISOBMFFAtom {
	/**
	 * Construct a null atom.
	 */
	constructor() {
		super(4, null);
	}
}

/**
 * This is the root block for all ISOBMFF block, The whole file.
 */
export class RootBlock extends ISOBMFFBlock {
	/**
	 * Construct a new root block.
	 *
	 * @param  {Buffer} buffer The buffer that contains the file.
	 */
	constructor(buffer) {
		super(buffer.length, null, buffer);
	}
}

/**
 * A ISO BMFF block for an ftyp block.
 * ISO
 */
class FtypAtom extends ISOBMFFAtom {
	/**
	 * Construct a new Ftyp block.
	 *
	 * @param  {number} length   The length of the block.
	 * @param  {string} tag      The block tag.
	 * @param  {Buffer} content  The content of the block.
	 */
	constructor(length, tag, content) {
		super(length, tag);

		this.majorBrand = this.readBrand(0, content);
		this.minorVersion = content.readUInt32BE(4);
		this.compatibleBrands = [];

		const numberOfCompatBrands = (length - 16) / 4;

		for (let i = 0; i < numberOfCompatBrands; i++) {
			this.compatibleBrands.push(this.readBrand((i * 4) + 8, content));
		}
	}

	/**
	 * Read a brand from a block.
	 *
	 * @param  {number} offset The offset to start reading at
	 * @param  {Buffer} buffer The buffer to read from
	 * @returns {string}       The brand.
	 */
	readBrand(offset, buffer) {
		return buffer.subarray(offset, offset + 4).toString('ascii');
	}
}

/**
 * The ISPE atom. Contains the image width and image height.
 */
class ISPEAtom extends ISOBMFFAtom {
	/**
	 * Construct a new ispe block.
	 *
	 * @param  {number} length   The length of the block.
	 * @param  {string} tag      The block tag.
	 * @param  {Buffer} content  The content of the block.
	 */
	constructor(length, tag, content) {
		super(length, tag);
		this.unknown = content.readUInt32BE(0);
		this.width = content.readUInt32BE(4);
		this.height = content.readUInt32BE(8);
	}
}

/**
 * The PIXI atom. Contains the Pixel format.
 */
class PIXIAtom extends ISOBMFFAtom {
	/**
	 * Construct a new pixi block.
	 *
	 * @param  {number} length   The length of the block.
	 * @param  {string} tag      The block tag.
	 * @param  {Buffer} buffer  The content of the block.
	 */
	constructor(length, tag, buffer) {
		super(length, tag);

		const UNKNOWN_BITS = 4;

		this.unknown = buffer.readUInt32BE(0);
		this.channels = buffer.readUInt8(UNKNOWN_BITS);
		this.bitsPerChannel = [];

		for (let i = 0; i < this.channels; i++) {
			this.bitsPerChannel.push(buffer.readUInt8(UNKNOWN_BITS + 1));
		}
	}
}


/**
 * A 'iinf' block.
 */
class IINFBlock extends ISOBMFFBlock {
	/**
	 * Construct a new IINFBlock.
	 *
	 * @param  {number} length The length of the block
	 * @param  {string} tag    The block tag
	 * @param  {Buffer} buffer The buffer that contains the block content
	 */
	constructor(length, tag, buffer) {
		super(length, tag, buffer, 6);
	}
}


const BLOCK_TYPES = {
	'ftyp': FtypAtom,

	// HEIC/AVIF
	'meta': ISOBMFFBlock,
	'iprp': ISOBMFFBlock,
	'iinf': IINFBlock,
	'ipco': ISOBMFFBlock,
	'ispe': ISPEAtom,
	'pixi': PIXIAtom,
	// 'colr': COLRAtom, // Color Profile
};
