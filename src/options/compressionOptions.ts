import { Request } from 'express';

export const compressionOption = {
    level: 1, // Compression level (1-9)
    threshold: 10240, // Minimum response size to compress (bytes)
    minRatio: 0.8, // Ratio of compressed to uncompressed size to trigger compression
    // cache: true, // Enable caching of compressed files
    filter: (req: Request) => {
        // Exclude image files from compression
        if (/\.jpg$|\.jpeg$|\.png$|\.gif$/.test(req.path)) {
            return false;
        }
        return true;
    }
};
