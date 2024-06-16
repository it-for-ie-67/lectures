import { useEffect } from "react";
import { useFileMapStore } from "./store";
import { type FileMapData } from "./types";
import { findFolderIdByName } from "./useFileMap";
async function getData() {
  const res = await fetch("./filemap/filemap.json");
  const data = (await res.json()) as FileMapData;
  return data;
}
function useData() {
  const [setFileMapData, setCurrentFolder] = useFileMapStore((state) => [
    state.setFileMapData,
    state.setCurrentFolder,
  ]);
  useEffect(() => {
    getData().then((data) => {
      setFileMapData(data);
      const folderId = findFolderIdByName(data.fileMap, "lectures");
      setCurrentFolder(folderId);
    });
  }, []);
}

export default useData;
