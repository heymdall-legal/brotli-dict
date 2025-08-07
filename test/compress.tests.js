const test = require('node:test');
const path = require('node:path');
const fs = require('node:fs/promises');
const { compress } = require('../lib');

test('should compress file with default brotli dictionary', async (t) => {
    const fileToCompress = await fs.readFile(path.join(__dirname, './testdata/alice2.txt'), null);
    const compressed = await compress(fileToCompress, { quality: 9 });

    const compressedByCli = await fs.readFile(path.join(__dirname, './testdata/alice2.compressed.9.br'), null);

    // The first char of the output is different between our function and the CLI version.
    // It presumably represents the window size difference when encoding. It has no impact
    // on decoding outcomes.
    const compressedBuffer = Buffer.from(compressed).subarray(1);
    const compressedByCliWithoutHeader = compressedByCli.subarray(1);

    t.assert.strictEqual(compressedByCliWithoutHeader.equals(compressedBuffer), true);
});

test('should compress file with custom dictionary', async (t) => {
    const fileToCompress = await fs.readFile(path.join(__dirname, './testdata/alice2.txt'), null);
    const dictionary = await fs.readFile(path.join(__dirname, './testdata/alice1.txt'), null);
    const compressed = await compress(fileToCompress, { dictionary });

    const compressedByCli = await fs.readFile(path.join(__dirname, './testdata/alice2.compressed.dict.br'), null);

    // The first char of the output is different between our function and the CLI version.
    // It presumably represents the window size difference when encoding. It has no impact
    // on decoding outcomes.
    const compressedBuffer = Buffer.from(compressed).subarray(1);
    const compressedByCliWithoutHeader = compressedByCli.subarray(1);

    t.assert.strictEqual(compressedByCliWithoutHeader.equals(compressedBuffer), true)
});
