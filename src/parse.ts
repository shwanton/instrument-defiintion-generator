import path from "path";
import { createReadStream, writeFileSync } from "fs";
import { createInterface } from "readline";

async function* generateFileContent(): AsyncGenerator<string> {
  const filename = path.join(__dirname, "../", "input.txt");
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
// const NPRN_REGEX = /^(\d+):(\d+):(\d+)\s(.*)$/;

(async () => {
  const rows = [];
  for await (const line of generateFileContent()) {
    // console.log(line);

    const parts = line.match(CC_REGEX);
    if (parts == null) {
      break;
    }

    const row = { number: Number(parts[1]), name: parts[2] };
    // const row = {
    //   msb: Number(parts[1]),
    //   lsb: Number(parts[2]),
    //   depth: Number(parts[3]),
    //   name: parts[4],
    // };
    console.log(row);
    rows.push(row);
  }

  const json = JSON.stringify(rows);
  writeFileSync("ouput.json", json);
})();
