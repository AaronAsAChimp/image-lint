import {ISOBMFFAtom} from './isobmff.js';


test('read an ISOBMFF atom from an AVIF file.', () => {
	const atom = ISOBMFFAtom.read(Buffer.from('0000001C667479706176696600000000617669666D6966316D696166', 'hex'), 0);

	expect(atom.length).toBe(28);
	expect(atom.tag).toBe('ftyp');
	expect(atom.majorBrand).toBe('avif');
	expect(atom.minorVersion).toBe(0);
	expect(atom.compatibleBrands.length).toBe(3);
	expect(atom.compatibleBrands).toContain('avif');
	expect(atom.compatibleBrands).toContain('mif1');
	expect(atom.compatibleBrands).toContain('miaf');
});

test('read an ISOBMFF atom from an HEIC file.', () => {
	const atom = ISOBMFFAtom.read(Buffer.from('000000186674797068656963000000006D69663168656963', 'hex'), 0);

	expect(atom.length).toBe(24);
	expect(atom.tag).toBe('ftyp');
	expect(atom.majorBrand).toBe('heic');
	expect(atom.minorVersion).toBe(0);
	expect(atom.compatibleBrands.length).toBe(2);
	expect(atom.compatibleBrands).toContain('mif1');
	expect(atom.compatibleBrands).toContain('heic');
});
