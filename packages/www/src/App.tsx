import { type Config, type State } from "@packages/generator";
import { useRef, useState } from "react";

import rampleConfig from "./rample.json";
import blofeldConfig from "./blofeld.json";
import circuitTracksConfig from "./circuit_tracks.json";
import { useCreateFileDownload } from "./hooks/useFileDownload";

interface ConfigMapping {
  [key: string]: Config;
}

const CONFIG_FILE_MAP = {
  rample: rampleConfig as Config,
  blofeld: blofeldConfig as Config,
  circuit_tracks: circuitTracksConfig as Config,
} as ConfigMapping;

function App() {
  const [selectedConfig, setSelectedConfig] = useState("rample");
  const downloadAnchorRef = useRef<HTMLAnchorElement>(null);
  const configs = Object.entries(CONFIG_FILE_MAP);
  const state = {
    showEmptySections: true,
    filename: selectedConfig,
  } as State;

  const createDownloadFromConfig = useCreateFileDownload(
    CONFIG_FILE_MAP[selectedConfig],
    state,
    downloadAnchorRef
  );

  console.log("render");

  return (
    <div className="App">
      <header className="App-header">
        <p>Choose definition file to download</p>
      </header>
      <main>
        <select
          value={selectedConfig}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedConfig(event.target.value);
          }}
        >
          {configs.map(([key]) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
        <button onClick={createDownloadFromConfig}>Download</button>
        <a hidden id="foo" ref={downloadAnchorRef}>
          download
        </a>
      </main>
    </div>
  );
}

export default App;
