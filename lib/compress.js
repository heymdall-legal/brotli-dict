const compressWasm = require('../bin/compress');
// const compressWasm = require('../bin/compress');

/**
 * Compresses the given buffer
 * @param {Uint8Array} buffer data to compress
 * @param {number} quality compression level (0-11); bigger values cause denser, but slower compression
 * @param {Uint8Array} dictionary data to use as dictionary
 * @param {number} mode Compression mode, 0 - generic, 1 - text, 2 - font (WOFF 2)
 * @param {number} lgwin LZ77 window size
 * @returns {Promise<Uint8Array>}
 */
async function compress(buffer, { quality = 11, dictionary = '', mode = 0, lgwin = 22, }) {
    const brotli = await compressWasm();

    const buf = brotli._malloc(buffer.length);
    brotli.HEAPU8.set(buffer, buf);
    // allocate dictionary buffer and copy data to it
    const dict = brotli._malloc(dictionary.length);
    brotli.HEAPU8.set(dictionary, dict);
    // allocate output buffer (same size + some padding to be sure it fits), and encode
    const outBuf = brotli._malloc(buffer.length + 1024);
    const encodedSize = brotli._encodeWithDictionary(quality, lgwin, mode, buffer.length, buf, dictionary.length, dict, buffer.length + 1024, outBuf);
    let outBuffer = null;
    if (encodedSize !== -1) {
        // allocate and copy data to an output buffer
        outBuffer = new Uint8Array(encodedSize);
        outBuffer.set(brotli.HEAPU8.subarray(outBuf, outBuf + encodedSize));
    }
    // free malloc'd buffers
    brotli._free(buf);
    brotli._free(outBuf);
    if (!outBuffer) {
        throw new Error('Unable to compress');
    }
    return outBuffer;
}

module.exports = compress;
