import { useMemo } from "react";
import { FileData } from "chonky/dist/types/file.types";
import { FileMapGenerated } from "./types";

export const useFiles = (
  currentFolderId: string,
  fileMap: FileMapGenerated | null
) => {
  return useMemo(() => {
    if (!fileMap || !currentFolderId || !fileMap[currentFolderId]) return [];

    const currentFolder = fileMap[currentFolderId];
    const files = currentFolder.childrenIds
      ? currentFolder.childrenIds.map(
          (fileId: string) => fileMap[fileId] ?? null
        )
      : [];
    return files as FileData[];
  }, [currentFolderId, fileMap]);
};

export const useFolderChain = (
  currentFolderId: string,
  fileMap: FileMapGenerated | null
) => {
  return useMemo(() => {
    if (!fileMap || !currentFolderId || !fileMap[currentFolderId]) return [];

    const currentFolder = fileMap[currentFolderId];
    const folderChain = [currentFolder];

    let parentId = currentFolder.parentId;
    while (parentId) {
      const parentFile = fileMap[parentId];
      if (parentFile) {
        folderChain.unshift(parentFile);
        parentId = parentFile.parentId;
      } else {
        parentId = null;
      }
    }
    const folderChainRemovedRoot = folderChain.slice(1);
    return folderChainRemovedRoot;
  }, [currentFolderId, fileMap]);
};

export function findFolderIdByName(fileMap: FileMapGenerated, name: string) {
  for (const [key, value] of Object.entries(fileMap)) {
    if (value.name === name && value.isDir) {
      return key;
    }
  }
  return "";
}
