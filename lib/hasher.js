/* @flow */
'use strict';

const TRIE_DEPTH = 3;
const HASH_TYPE = 'sha1';
const crypto = require('crypto');

/*::
const Finder = require('./finder');

import type { FileDescriptor } from './finder';

type Trie = Map<string, Trie>;
*/

class Hasher {
	/*::
	trie: Trie;
	*/
	constructor() {
		this.trie = new Map();
	}

	find (digest/*: string */)/*: Trie */ {
		var hash = crypto.createHash(HASH_TYPE),
			current = this.trie,
			depth = 0;

		// Descend down the trie to find the leaf that contains this digest.
		while (depth <= TRIE_DEPTH) {
			let previous = current,
				byte = digest[depth];

			current = current.get(byte);

			if (!current) {
				current = new Map();
				previous.set(byte, current);
			}

			depth++;
		}

		return current;
	}

	contains(path/*: string */, buffer/*: Buffer */)/*: ?string */ {
		// The leaf should contain a map of digests to file names.
		var hash = crypto.createHash(HASH_TYPE);

		hash.update(buffer);

		let digest = hash.digest('binary'),
			hashes = this.find(digest),
			found_name = hashes.get(digest);

		if (!found_name) {
			hashes.set(digest, path);
		}

		return found_name;
	}
}

module.exports = Hasher;
