const generateWasm = require('../bazel-bin/brotli_dict_wasm/cpp/generate/generate');


/**
 * Create a custom brotli dictionary from provided buffers.
 * @param {number} dictionarySizeLimit Size limit of a resulting dictionary, in bytes. Must be greater than 255
 * @param {number} sliceLength Text size slice, from 4 to 256
 * @param {number} blockLength from 16 to 65 536
 * @param {Uint8Array[]} data
 * @returns {Promise<Uint8Array>}
 */
async function generate({ dictionarySizeLimit = 16384, sliceLength = 16, blockLength = 1024, data }) {
    if (sliceLength < 4 || sliceLength > 256) {
        throw new Error('sliceLength should be between 4 and 256');
    }
    if (blockLength < 16 || blockLength > 65536) {
        throw new Error('blockLength should be between 16 and 65 536');
    }

    if (dictionarySizeLimit < 256) {
        throw new Error('dictionarySizeLimit should be greater than 255');
    }

    const brotli = await generateWasm();

    const sizes = data.map(d => d.byteLength);

    return brotli.generate_dictionary(dictionarySizeLimit, sliceLength, blockLength, sizes, data);
}

module.exports = generate;
