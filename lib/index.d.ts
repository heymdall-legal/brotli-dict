type CompressOptions = {
    /**
     * Used as raw (LZ77) dictionary; same dictionary MUST be used both for compression and decompression
     */
    dictionary?: Uint8Array;
    /**
     * LZ77 window size
     */
    lgwin?: number;
    /**
     * Compression mode, 0 - generic, 1 - text, 2 - font (WOFF 2)
     */
    mode?: number;
    /**
     * Compression level (0-11); bigger values cause denser, but slower compression
     */
    quality?: number;
};

/**
 * Compress input with brotli
 * @param buffer data to compress
 * @param options compression settings
 */
export function compress(buffer: Uint8Array, options?: CompressOptions): Promise<Uint8Array>;

type GenerateDictionaryOptions = {
    dictionarySizeLimit: number;
    sliceLength?: number;
    blockLength?: number;
    data: Uint8Array[];
};

/**
 * Create a custom brotli dictionary from provided buffers
 * @param options
 */
export function generateDictionary(options: GenerateDictionaryOptions): Promise<Uint8Array>;
