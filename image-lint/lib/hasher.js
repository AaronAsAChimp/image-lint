/* @flow */
'use strict';

import crypto from 'crypto';

const TRIE_DEPTH = 3;
const HASH_TYPE = 'sha1';

/*::
const Finder = require('./finder');

import type { FileDescriptor } from './finder';

type Trie = Map<string, Map<string, Map<string, Trie>>>;
*/

/**
 * Find duplicate files.
 */
export class Hasher {
	/*::
	trie: Trie;
	*/

	/**
	 * Construct a new Hasher.
	 */
	constructor() {
		this.trie = new Map();
	}

	/**
	 * Retrive the branch of the Trie that would contain the given digest.
	 * @param  {string} digest A unique hash.
	 * @return {Trie}          The sub Trie.w
	 */
	find(digest/*: string */)/*: Trie */ {
		let current = this.trie;
		let depth = 0;

		// Descend down the trie to find the leaf that contains this digest.
		while (depth <= TRIE_DEPTH) {
			const previous = current;
			const byte = digest[depth];

			current = current.get(byte);

			if (!current) {
				current = new Map();
				previous.set(byte, current);
			}

			depth++;
		}

		return current;
	}

	/**
	 * Determine if the given buffer has already been seen. If not the hash and
	 * path will be added to the Trie.
	 * @param  {string} path    The path to the file.
	 * @param  {Buffer} buffer  The file's content
	 * @return {boolean}        The path of the existing file with the
	 *                          same contents.
	 */
	contains(path/*: string */, buffer/*: Buffer */)/*: ?string */ {
		// The leaf should contain a map of digests to file names.
		const hash = crypto.createHash(HASH_TYPE);

		hash.update(buffer);

		const digest = hash.digest('binary');
		const hashes = this.find(digest);
		const found_name = hashes.get(digest);

		if (!found_name) {
			hashes.set(digest, path);
		}

		return found_name;
	}
}
