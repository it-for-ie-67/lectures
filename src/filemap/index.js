import { promises, statSync, existsSync, writeFileSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let fileMap = {
  fileMap: {},
};

async function* walk(dir, rootDirId, rootFolderName) {
  for await (const d of await promises.opendir(resolve(dir))) {
    // grab the stats we need and set unique ids
    const parentStats = statSync(resolve(dir));
    const parentId = `${parentStats.dev}-${parentStats.ino}`;
    const stats = statSync(join(resolve(dir), d.name));
    const fileId = `${stats.dev}-${stats.ino}`;
    const entry = join(resolve(dir), d.name);

    if (d.isDirectory()) {
      // create the directory entry if it doesn't exist
      if (!fileMap.fileMap[fileId]) {
        fileMap.fileMap[fileId] = {
          id: fileId,
          name: d.name,
          isDir: true,
          childrenIds: [],
          fullPath: entry,
        };

        if (fileId !== parentId) fileMap.fileMap[fileId].parentId = parentId;
      }

      // populate the parent dir entry if it doesn't exist
      if (!fileMap.fileMap[parentId]) {
        fileMap.fileMap[parentId] = {
          id: parentId,
          name: parentId === rootDirId ? rootFolderName : d.name,
          isDir: true,
          childrenIds: [fileId],
          fullPath: resolve(dir),
        };
      } else {
        // otherwise, just append this id to the existing parent
        fileMap.fileMap[parentId].childrenIds.push(fileId);
      }

      // recursively go to next dir
      yield* await walk(entry, rootDirId);
    } else if (d.isFile()) {
      // populate the parent dir entry if it doesn't exist
      if (!fileMap.fileMap[parentId]) {
        fileMap.fileMap[parentId] = {
          id: parentId,
          name: parentId === rootDirId ? rootFolderName : d.name,
          isDir: true,
          childrenIds: [fileId],
          fullPath: resolve(dir),
        };
      } else {
        // otherwise, just append this id to the existing parent
        fileMap.fileMap[parentId].childrenIds.push(fileId);
      }

      // add the entry for the file
      fileMap.fileMap[fileId] = {
        id: fileId,
        name: d.name,
        parentId: `${parentStats.dev}-${parentStats.ino}`,
        size: stats.size,
        modDate: stats.mtime,
        fullPath: entry,
      };

      yield entry;
    }
  }
}

async function walkDirectory(dir, rootFolderName) {
  // check the dir exists
  if (!existsSync(dir)) return undefined;

  // set root stuff
  const rootDir = resolve(dir);
  const getRootDir = () => resolve(rootDir);
  const rootDirStats = statSync(getRootDir());
  const rootDirId = `${rootDirStats.dev}-${rootDirStats.ino}`;

  // create initial return object
  fileMap = {
    rootFolderId: rootDirId,
    fileMap: {},
  };

  // do the walk
  for await (const p of walk(getRootDir(), rootDirId, rootFolderName)) {
  }

  return fileMap;
}

const publicPath = join(__dirname, "../../", "public");
const rootDir = join(publicPath, "lectures");
walkDirectory(publicPath, rootDir).then((res) => {
  writeFileSync(
    join(publicPath, "filemap", "filemap.json"),
    JSON.stringify(res, null, 2)
  );
});

export default {
  walkDirectory,
};
