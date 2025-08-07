# brotli-dict

Set of tools to work with brotli dictionaries used in [Compression Dictionary Transport](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Compression_dictionary_transport) technology.

1. `compress` method that supports compression with a custom dictionary which currently is not supported in [native brotli](https://nodejs.org/api/zlib.html#class-brotlioptions) implementation.
2. `generateDictionary` method that can be used to create a dictionary from a set of different files.

## Compatibility

All of these methods intended to be used in Node.js environment. Wasm implementation probably will work in a browser, but I did not test it.

## Installation

```bash
npm install brotli-dict
```

## Usage

```javascript
const { compress, generateDictionary } = require('brotli-dict');

// Compress data with a custom dictionary
const data = new Uint8Array(Buffer.from('Hello, world!'));
const dictionary = new Uint8Array(Buffer.from('Hello, '));

compress(data, { dictionary }).then(compressed => {
    console.log('Compressed size:', compressed.length);
});

// Generate a dictionary from multiple buffers
const options = {
    dictionarySizeLimit: 1024,
    data: [
        new Uint8Array(Buffer.from('sample text 1')),
        new Uint8Array(Buffer.from('sample text 2'))
    ]
};

generateDictionary(options).then(dict => {
    console.log('Generated dictionary size:', dict.length);
});
```

## API

### `compress(buffer, options?)`

Compresses input data using Brotli with optional dictionary support.

**Parameters:**
- `buffer` (Uint8Array): Data to compress
- `options` (CompressOptions, optional):
  - `dictionary` (Uint8Array): Raw LZ77 dictionary for compression
  - `lgwin` (number): LZ77 window size
  - `mode` (number): Compression mode (0=generic, 1=text, 2=font/WOFF2)
  - `quality` (number): Compression level 0-11 (higher = denser but slower)

**Returns:** `Promise<Uint8Array>` - Compressed data

### `generateDictionary(options)`

Create a custom Brotli dictionary from provided data buffers.

**Parameters:**
- `options` (GenerateDictionaryOptions):
  - `dictionarySizeLimit` (number): Maximum dictionary size in bytes
  - `data` (Uint8Array[]): Array of data buffers to create dictionary from
  - `sliceLength` (number, optional): Length of text slices to analyze
  - `blockLength` (number, optional): Block size for dictionary generation

**Returns:** `Promise<Uint8Array>` - Generated dictionary

## CLI Usage

This package also provides a command-line interface for both compression and dictionary generation.

### Compress Command

```bash
npx brotli-dict compress input.txt -o output.br [-d dictionary.dict] [-q 6] [--mode 1] [--lgwin 22]
```

**Options:**
- `input` - Input file to compress (required)
- `-o, --output` - Output file path (required)
- `-d, --dictionary` - Dictionary file to use for compression (optional)
- `-q, --quality` - Compression quality level 0-11 (optional)
- `--mode` - Compression mode: 0=generic, 1=text, 2=font (optional)
- `--lgwin` - LZ77 window size (optional)

**Example:**
```bash
npx brotli-dict compress example.txt -o example.txt.br -d my-dict.dict -q 9
```

### Generate Dictionary Command

```bash
npx brotli-dict generate file1.txt file2.txt file3.txt -o dictionary.dict [-s 8192] [--sliceLength 16] [--blockLength 64]
```

**Options:**
- `input files` - Multiple input files to generate dictionary from (required)
- `-o, --output` - Output dictionary file path (required)
- `-s, --sizeLimit` - Maximum dictionary size in bytes (optional)
- `--sliceLength` - Length of text slices to analyze (optional)
- `--blockLength` - Block size for dictionary generation (optional)

**Example:**
```bash
npx brotli-dict generate *.html -o web-dict.dict -s 4096
```

## Building

This package requires [bazelisk](https://github.com/bazelbuild/bazelisk) to build. It takes care of building wasm code
and deals with native dependencies.
