import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const readDirectory = promisify(fs.readdir);
const lstat = promisify(fs.lstat);

export default async function getDirectoryContent(directory) {
  try {
    const files = await readDirectory(directory);
    const results = await Promise.all(files.map(async (item) => {
      try {
        const itemPath = path.resolve(directory, item);
        const stats = await lstat(itemPath);

        return {
          name: item,
          path: itemPath,
          isDirectory: stats.isDirectory(),
          size: stats.size,
          lastModified: stats.mtimeMs,
        };
      } catch (e) {
        return undefined;
      }
    }));

    return results.filter((item) => !!item);
  } catch (e) {
    return null;
  }
}
