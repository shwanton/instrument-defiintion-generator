import path from "path";
import { readFileSync } from "fs";

import type { Config } from "../generator";
import { genDefinitions } from "../generator";

it.skip("should create empty definitions from empty config json", () => {
  const filename = path.join(__dirname, "../../examples", "template.txt");
  const content = readFileSync(filename, "utf8");

  const config = {
    VERSION: 1,
    TRACKNAME: null,
    TYPE: null,
    OUTPORT: null,
    OUTCHAN: null,
    INPORT: null,
    INCHAN: null,
    DRUMLANES: null,
    PC: null,
  } as Config;
  expect(genDefinitions(config)).toEqual(content);
});

it("should create blofeld definitions from config json", () => {
  const filename = path.join(__dirname, "../../examples", "blofeld.txt");
  const content = readFileSync(filename, "utf8");

  const json_filename = path.join(__dirname, "../../configs", "blofeld.json");
  const json = readFileSync(json_filename, "utf8");

  const config = JSON.parse(json) as Config;
  expect(genDefinitions(config)).toEqual(content);
});
