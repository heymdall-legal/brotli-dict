const test = require('node:test');
const path = require('node:path');
const fs = require('node:fs/promises');
const { generateDictionary } = require('../lib');

test('should create dictionary from multiple files', async (t) => {
    const v1 = await fs.readFile(path.join(__dirname, './testdata/alice1.txt'), null);
    const v2 = await fs.readFile(path.join(__dirname, './testdata/alice2.txt'), null);

    const dict = Buffer.from(await generateDictionary({
        data: [v1, v2],
        dictionarySizeLimit: 50_000,
    }));

    const cliVersion = await fs.readFile(path.join(__dirname, './testdata/txt-dict.bin'), null);

    t.assert.strictEqual(dict.equals(cliVersion), true);
});
