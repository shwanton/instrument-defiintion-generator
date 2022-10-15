import path from "path";
import { readFileSync } from "fs";
import { getDefinitions } from "../template_generator";

it("should create template from base config", () => {
  const filename = path.join(__dirname, "../../examples", "template.txt");
  const content = readFileSync(filename, "utf8");

  expect(getDefinitions()).toEqual(content);
});
