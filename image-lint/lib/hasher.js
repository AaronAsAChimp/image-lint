// This alleviates the need to pull in a browser compatible version of
// the 'crypto' module.
const crypto = globalThis.crypto;
const HASH_TYPE = 'SHA-1';


/**
 * @typedef {Map<string, Map<string, Map<string, Map<ArrayBuffer, string>>>>} Trie
 */

/**
 * Find duplicate files.
 */
export class Hasher {
	/**
	 * Construct a new Hasher.
	 */
	constructor() {
		/** @type {Trie} */
		this.trie = new Map();
	}

	/**
	 * Retrive the branch of the Trie that would contain the given digest.
	 *
	 * @param  {ArrayBuffer} digest        A unique hash.
	 * @returns {Map<ArrayBuffer, string>} The sub Trie.
	 */
	find(digest) {
		let byte = digest[0];
		let lvl1 = this.trie.get(byte);

		if (!lvl1) {
			lvl1 = new Map();
			this.trie.set(byte, lvl1);
		}

		byte = digest[1];
		let lvl2 = lvl1.get(byte);

		if (!lvl2) {
			lvl2 = new Map();
			lvl1.set(byte, lvl2);
		}


		byte = digest[2];
		let lvl3 = lvl2.get(byte);

		if (!lvl3) {
			lvl3 = new Map();
			lvl2.set(byte, lvl3);
		}

		return lvl3;
	}

	/**
	 * Determine if the given buffer has already been seen. If not, the hash and
	 * path will be added to the Trie.
	 *
	 * @param  {string} path    The path to the file.
	 * @param  {Buffer} buffer  The file's content
	 *
	 * @returns {Promise<boolean>}
	 *     The path of the existing file with the same contents.
	 */
	async contains(path, buffer) {
		// The leaf should contain a map of digests to file names.

		const digest = await crypto.subtle.digest(HASH_TYPE, buffer)
		const hashes = this.find(digest);
		const found_name = hashes.get(digest);

		if (!found_name) {
			hashes.set(digest, path);
		}

		return !!found_name;
	}
}
