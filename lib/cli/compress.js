const fs = require('node:fs/promises');
const compress = require('../compress');
const cliArgs = require('command-line-args');
const { validateFilePath, ensureAbsolutePath } = require('./utils');

async function compressCli(argv) {
    const compressOptionsDefinition = [
        { name: 'input', defaultOption: true, type: String },
        { name: 'output', alias: 'o', type: String },
        { name: 'dictionary', alias: 'd', type: String },
        { name: 'quality', alias: 'q', type: Number },
        { name: 'mode', type: Number },
        { name: 'lgwin', type: Number },
    ];

    const compressOptions = cliArgs(compressOptionsDefinition, { argv });

    if (!compressOptions.input || !compressOptions.output) {
        console.error('Input and output must be defined');
        process.exit(1);
    }

    const inputFilename = await validateFilePath(compressOptions.input);
    const input = await fs.readFile(inputFilename, null);

    let dictionary = '';

    if (compressOptions.dictionary) {
        const dictionaryFilename = await validateFilePath(compressOptions.dictionary);
        dictionary = await fs.readFile(dictionaryFilename, null);
    }

    const result = await compress(input, {
        quality: compressOptions.quality,
        mode: compressOptions.mode,
        lgwin: compressOptions.lgwin,
        dictionary,
    });
    const outputFilename = ensureAbsolutePath(compressOptions.output);

    await fs.writeFile(outputFilename, result);
    console.log(`Successfully compressed ${input.length} bytes to ${result.length} bytes. Wrote results to ${outputFilename}`);
}

module.exports = compressCli;
