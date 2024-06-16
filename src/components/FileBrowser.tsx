import { useCallback } from "react";
import { useFileMapStore } from "../lib/store";
import { FullFileBrowser, FileActionHandler } from "chonky";
import { useFiles, useFolderChain } from "../lib/useFileMap";

const FileBrowser = () => {
  const [data, currentFolder, setCurrentFolder] = useFileMapStore((state) => [
    state.fileMapData,
    state.currentFolder,
    state.setCurrentFolder,
  ]);

  const fileMap = data?.fileMap || null;

  if (fileMap && currentFolder) {
    // console.log(currentFolder, fileMap[currentFolder]);
  }

  const files = useFiles(currentFolder, fileMap);
  const folderChain = useFolderChain(currentFolder, fileMap);
  const url = folderChain.map((folder) => folder.name).join("/");

  // console.log(folderChain, url);
  const handleAction = useCallback<FileActionHandler>(
    (data) => {
      // console.log("File action data:", data);
      if (data.id === "open_files") {
        const file = data.payload.targetFile;
        if (file) {
          if (file.isDir) {
            console.log("Opening Folder:", file);
            setCurrentFolder(file.id);
          } else {
            const fileURL = `./${url}/${file.name}`;
            console.log("Opening File:", fileURL);
            window.open(fileURL);
          }
        }
      }
    },
    [url]
  );

  return (
    <div style={{ height: "75vh" }}>
      <FullFileBrowser
        files={files}
        folderChain={folderChain}
        onFileAction={handleAction}
      />
    </div>
  );
};

export default FileBrowser;
