import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  verbose: true,
};

export default config;
