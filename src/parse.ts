import path from "path";
import { createReadStream, writeFileSync } from "fs";
import { createInterface } from "readline";

async function* generateFileContent(): AsyncGenerator<string> {
  const filename = path.join(__dirname, "../examples", "scratch.txt");
  const fileStream = createReadStream(filename);

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    yield line;
  }
}

const CC_REGEX = /(\d+)\s(.*)/;
// const DRUMLANE_REGEX = /^(.*)\s([A-Z]+)/;

(async () => {
  const rows = [];
  for await (const line of generateFileContent()) {
    // console.log(line);

    const parts = line.match(CC_REGEX);
    if (parts == null) {
      break;
    }

    rows.push({ number: Number(parts[1]), name: parts[2] });
  }

  const json = JSON.stringify(rows);
  writeFileSync("result.json", json);
})();
