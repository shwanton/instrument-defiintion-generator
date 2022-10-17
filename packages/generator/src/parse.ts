import path from "path";
import { createReadStream, writeFileSync } from "fs";
import { createInterface } from "readline";

const PWD = path.join(__dirname, "../../..");

async function* genLines(): AsyncGenerator<string> {
  const filename = path.join(PWD, "tmp", "input.txt");
  const fileStream = createReadStream(filename);

  const readline = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of readline) {
    yield line;
  }
}

// const DRUMLANE_REGEX = /^(.*)\s([A-Z\d]+)/;
// const PC_REGEX = /^(.*)\s([A-Z\d]+)$/;
const CC_REGEX = /(\d+)\s(.*)$/;
// const NPRN_REGEX = /^(\d+):(\d+):(\d+)\s(.*)$/;

(async () => {
  const lines = [];
  for await (const line of genLines()) {
    // const parts = line.match(DRUMLANE_REGEX);
    // const parts = line.match(PC_REGEX);
    const parts = line.match(CC_REGEX);
    if (parts == null) {
      break;
    }

    // DrumLane
    // const row = { number: parts[1], name: parts[2] };
    // PC
    // const row = { number: parts[1], name: parts[2] };
    // CC
    const row = { number: Number(parts[1]), name: parts[2] };
    // NPRN
    // const row = {
    //   msb: Number(parts[1]),
    //   lsb: Number(parts[2]),
    //   depth: Number(parts[3]),
    //   name: parts[4],
    // };
    console.log(row);
    lines.push(row);
  }

  const json = JSON.stringify(lines);
  const filename = path.join(PWD, "tmp", "output.json");
  writeFileSync(filename, json);
})();
