import { type Config, genDefinitions } from "./generator";

import config from "../configs/circuit-tracks.json";

const result = genDefinitions(config as Config);

console.log(result);
