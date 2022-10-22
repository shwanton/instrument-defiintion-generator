import path from "path";
import { readFileSync } from "fs";

import type { Config, State } from "../generator";
import { genDefinitionText } from "../generator";

const PWD = path.join(__dirname, "../../../..");

function readExampleTextFile(filename: string): string {
  return readFileSync(path.join(PWD, "examples", filename), "utf8");
}

function readExampleJSONconfig(filename: string): Config {
  const json = readFileSync(path.join(PWD, "configs", filename), "utf8");
  return JSON.parse(json);
}

it("should create empty definitions from empty config json", () => {
  const expected_textfile = readExampleTextFile("template.txt");

  const config: Config = {
    VERSION: 1,
    TRACKNAME: null,
    TYPE: null,
    OUTPORT: null,
    OUTCHAN: null,
    INPORT: null,
    INCHAN: null,
    DRUMLANES: null,
    PC: null,
    COMMENT: null,
    CC: null,
    ASSIGN: null,
    AUTOMATION: null,
    NPRN: null,
  };

  const state: State = {
    showEmptySections: true,
  };

  expect(genDefinitionText(config, state)).toEqual(expected_textfile);
});

it("should create blofeld definitions from config json", () => {
  const expected_textfile = readExampleTextFile("blofeld.txt");
  const config = readExampleJSONconfig("blofeld.json");
  const state: State = {
    showEmptySections: false,
  };

  expect(genDefinitionText(config, state)).toEqual(expected_textfile);
});

it("should create norddrum3 definitions from config json", () => {
  const expected_textfile = readExampleTextFile("nord_drum_3p.txt");
  const config = readExampleJSONconfig("nord_drum_3p.json");
  const state: State = {
    showEmptySections: false,
  };

  expect(genDefinitionText(config, state)).toEqual(expected_textfile);
});

it("should create circuit_tracks definitions from config json", () => {
  const expected_textfile = readExampleTextFile("circuit_tracks.txt");
  const config = readExampleJSONconfig("circuit_tracks.json");
  const state: State = {
    showEmptySections: false,
  };

  expect(genDefinitionText(config, state)).toEqual(expected_textfile);
});

it("should create rample definitions from config json", () => {
  const expected_textfile = readExampleTextFile("rample.txt");
  const config = readExampleJSONconfig("rample.json");
  const state: State = {
    showEmptySections: false,
  };

  expect(genDefinitionText(config, state)).toEqual(expected_textfile);
});
