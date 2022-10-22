import { type Config, genDefinitionText } from "@packages/generator";
import { useRef } from "react";
import config from "./rample.json";

function App() {
  const downloadAnchorRef = useRef<HTMLAnchorElement>(null);
  const download = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (downloadAnchorRef.current == null) {
      return;
    }
    const state = {
      showEmptySections: false,
    };

    const text = genDefinitionText(config as Config, state);
    const blob = new Blob([text], { type: "text/plain" });

    const fileDownloadUrl = URL.createObjectURL(blob);

    downloadAnchorRef.current.setAttribute("href", fileDownloadUrl);
    downloadAnchorRef.current.setAttribute("download", "rample.txt");

    downloadAnchorRef.current?.click();

    URL.revokeObjectURL(fileDownloadUrl);
  };

  console.log("render", {
    ref: downloadAnchorRef.current,
  });

  return (
    <div className="App">
      <header className="App-header">
        <p>Choose definition file to download</p>
      </header>
      <main>
        <select></select>
        <button onClick={download}>Download the file!</button>
        <a hidden id="foo" ref={downloadAnchorRef}>
          download
        </a>
      </main>
    </div>
  );
}

export default App;
