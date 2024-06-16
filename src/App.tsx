import FileBrowser from "./components/FileBrowser";
import useData from "./lib/useData";

const youtubeURL =
  "https://youtube.com/playlist?list=PLNGLpHQhvGrvT_2VomKn37hYMRnP5L65n&si=_ZX4mMVbP57-roWz";
function App() {
  useData();
  return (
    <div className="container mx-auto mt-4">
      <div className="flex flex-col gap-3 items-start lg:flex-row lg:items-center lg:justify-between">
        <div className="font-extrabold text-transparent text-6xl lg:text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          IT for IE 67
        </div>
        <a
          href={youtubeURL}
          target="_blank"
          className="border px-2 py-1 rounded-lg bg-red-600 text-white text-sm lg:text-lg font-bold"
        >
          Youtube VDO
        </a>
      </div>
      <div className="mt-8">
        <FileBrowser />
      </div>
    </div>
  );
}

export default App;
