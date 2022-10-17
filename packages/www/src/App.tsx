import { type Config, genDefinitionText } from "@packages/generator";
import { useRef, useState } from "react";
import config from "./rample.json";

function App() {
  const [downloadUrl, setDownloadUrl] = useState("");
  const downloadAnchorRef = useRef<HTMLAnchorElement>(null);
  const download = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const text = genDefinitionText(config as Config);
    const blob = new Blob([text], { type: "text/plain" });
    const fileDownloadUrl = URL.createObjectURL(blob);
    setDownloadUrl(fileDownloadUrl);
    downloadAnchorRef.current?.click();
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Choose definition file to download</p>
      </header>
      <main>
        <select></select>
        <button onClick={download}>Download the file!</button>
        <a
          style={{ visibility: "hidden" }}
          download="foo.txt"
          href={downloadUrl}
          ref={downloadAnchorRef}
        />
      </main>
    </div>
  );
}

export default App;
