const fs = require('node:fs/promises');
const cliArgs = require('command-line-args');
const { validateFilePath, ensureAbsolutePath } = require('./utils');
const generate = require('../generate');

async function generateCli(argv) {
    const generateOptionsDefinition = [
        { name: 'output', alias: 'o', type: String },
        { name: 'input', defaultOption: true, multiple: true, type: String },
        { name: 'sizeLimit', alias: 's', type: Number },
        { name: 'sliceLength', type: Number },
        { name: 'blockLength', type: Number },
    ];

    const generateOptions = cliArgs(generateOptionsDefinition, { argv });

    if (!generateOptions.input || !generateOptions.output) {
        console.error('Input and output must be defined');
        process.exit(1);
    }

    const filenames = await Promise.all(generateOptions.input.map(validateFilePath));
    console.log(filenames)

    const files = await (Promise.all(filenames.map(async filename => fs.readFile(filename, null))));
    const content = await generate({
        dictionarySizeLimit: generateOptions.sizeLimit,
        sliceLength: generateOptions.sliceLength,
        blockLength: generateOptions.blockLength,
        data: files,
    });

    const outputFilename = ensureAbsolutePath(generateOptions.output);
    await fs.writeFile(outputFilename, content);
    console.log(`Successfully generated dictionary with length ${content.length}. Saved to ${outputFilename}.`);
}

module.exports = generateCli;
