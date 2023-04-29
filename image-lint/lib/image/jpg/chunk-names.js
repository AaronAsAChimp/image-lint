export const CHUNK_NAMES = new Map();

// Start Of Frame markers, non-differential, Huffman coding

CHUNK_NAMES.set(0xFFC0, 'SOF0');
CHUNK_NAMES.set(0xFFC1, 'SOF1');
CHUNK_NAMES.set(0xFFC2, 'SOF2');
CHUNK_NAMES.set(0xFFC3, 'SOF3');

// Start Of Frame markers, differential, Huffman coding

CHUNK_NAMES.set(0xFFC5, 'SOF5');
CHUNK_NAMES.set(0xFFC6, 'SOF6');
CHUNK_NAMES.set(0xFFC7, 'SOF7');

// Start Of Frame markers, non-differential, arithmetic coding

CHUNK_NAMES.set(0xFFC8, 'JPG');
CHUNK_NAMES.set(0xFFC9, 'SOF9');
CHUNK_NAMES.set(0xFFCA, 'SOF10');
CHUNK_NAMES.set(0xFFCB, 'SOF11');

// Start Of Frame markers, differential, arithmetic coding

CHUNK_NAMES.set(0xFFCD, 'SOF13');
CHUNK_NAMES.set(0xFFCE, 'SOF14');
CHUNK_NAMES.set(0xFFCF, 'SOF15');

// Huffman table specification

CHUNK_NAMES.set(0xFFC4, 'DHT');

// Arithmetic coding conditioning specification

CHUNK_NAMES.set(0xFFCC, 'DAC');

// Restart interval termination

CHUNK_NAMES.set(0xFFD0, 'RST1');
CHUNK_NAMES.set(0xFFD1, 'RST2');
CHUNK_NAMES.set(0xFFD2, 'RST3');
CHUNK_NAMES.set(0xFFD3, 'RST4');
CHUNK_NAMES.set(0xFFD4, 'RST5');
CHUNK_NAMES.set(0xFFD5, 'RST6');
CHUNK_NAMES.set(0xFFD6, 'RST7');
CHUNK_NAMES.set(0xFFD7, 'RST8');

// Other markers

CHUNK_NAMES.set(0xFFD8, 'SOI');
CHUNK_NAMES.set(0xFFD9, 'EOI');
CHUNK_NAMES.set(0xFFDA, 'SOS');
CHUNK_NAMES.set(0xFFDB, 'DQT');
CHUNK_NAMES.set(0xFFDC, 'DNL');
CHUNK_NAMES.set(0xFFDD, 'DRI');
CHUNK_NAMES.set(0xFFDE, 'DHP');
CHUNK_NAMES.set(0xFFDF, 'EXP');

for (let i = 0; i <= 0xF; i++) {
	CHUNK_NAMES.set(0xFFE0 + i, 'APP' + i);
}

for (let i = 0; i <= 0xD; i++) {
	CHUNK_NAMES.set(0xFFF0 + i, 'JPG ' + i);
}

CHUNK_NAMES.set(0xFFFE, 'COM');

// Reserved markers

CHUNK_NAMES.set(0xFF01, 'TEM');

for (let i = 0x2; i <= 0xBF; i++) {
	CHUNK_NAMES.set(0xFF02 + i, 'RES');
}
