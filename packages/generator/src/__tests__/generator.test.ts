import path from "path";
import { readFileSync } from "fs";

import type { Config } from "../generator";
import { genDefinitionText } from "../generator";

const PWD = path.join(__dirname, "../../../..");

function readExampleTextFile(filename: string): string {
  return readFileSync(path.join(PWD, "examples", filename), "utf8");
}

function readExampleJSONconfig(filename: string): Config {
  const json = readFileSync(path.join(PWD, "configs", filename), "utf8");
  return JSON.parse(json);
}

// it.skip("should create empty definitions from empty config json", () => {
//   const filename = path.join(__dirname, "../../examples", "template.txt");
//   const content = readFileSync(filename, "utf8");

//   const config = {
//     VERSION: 1,
//     TRACKNAME: null,
//     TYPE: null,
//     OUTPORT: null,
//     OUTCHAN: null,
//     INPORT: null,
//     INCHAN: null,
//     DRUMLANES: null,
//     PC: null,
//     COMMENT: null,
//   } as Config;
//   expect(genDefinitions(config)).toEqual(content);
// });

it("should create blofeld definitions from config json", () => {
  const expected_textfile = readExampleTextFile("blofeld.txt");
  const config = readExampleJSONconfig("blofeld.json");

  expect(genDefinitionText(config)).toEqual(expected_textfile);
});

it("should create norddrum3 definitions from config json", () => {
  const expected_textfile = readExampleTextFile("nord_drum_3p.txt");
  const config = readExampleJSONconfig("nord_drum_3p.json");

  expect(genDefinitionText(config)).toEqual(expected_textfile);
});

it("should create circuit_tracks definitions from config json", () => {
  const expected_textfile = readExampleTextFile("circuit_tracks.txt");
  const config = readExampleJSONconfig("circuit_tracks.json");

  expect(genDefinitionText(config)).toEqual(expected_textfile);
});

it("should create rample definitions from config json", () => {
  const expected_textfile = readExampleTextFile("rample.txt");
  const config = readExampleJSONconfig("rample.json");

  expect(genDefinitionText(config)).toEqual(expected_textfile);
});
