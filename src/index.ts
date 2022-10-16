import { type Config, genDefinitions } from "./generator";

import config from "../configs/blofeld.json";

const result = genDefinitions(config as Config);

console.log(result);
