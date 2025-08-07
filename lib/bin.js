const cliArgs = require('command-line-args');
const fs = require('node:fs/promises');
const generateDictionaryCli = require('./cli/generate-dictionary');
const compressCli = require('./cli/compress');

let mainDefinitions = [
    { name: 'name', defaultOption: true }
]
const mainCommand = cliArgs(mainDefinitions, { stopAtFirstUnknown: true })
const argv = mainCommand._unknown || []

if (mainCommand.name === 'compress') {
    compressCli(argv).catch(err => {
        console.error(`Unable to compress files: ${err}`);
        process.exit(1);
    });
} else if (mainCommand.name === 'generate') {
    generateDictionaryCli(argv).catch(err => {
        console.error(`Unable to generate dictionary: ${err}`);
        process.exit(1);
    });
} else {
    console.error(`Unknown command ${mainCommand.name}`);
    process.exit(1);
}
