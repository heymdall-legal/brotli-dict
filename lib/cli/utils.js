const path = require('node:path');
const fs = require('node:fs/promises');

function ensureAbsolutePath(dir) {
    if (!path.isAbsolute(dir)) {
        return path.join(process.cwd(), dir);
    }

    return dir;
}

async function validateFilePath(filePath) {
    const fullPath = ensureAbsolutePath(filePath);

    const stats = await fs.stat(fullPath);

    if (!stats.isFile()) {
        console.error(`Must be a file: ${fullPath}`);
        process.exit(1);
    }

    return fullPath;
}

module.exports = {
    ensureAbsolutePath,
    validateFilePath,
}
