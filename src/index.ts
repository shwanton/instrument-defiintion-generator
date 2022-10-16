import { type Config, genDefinitions } from "./generator";

import config from "../configs/norddrum3.json";

const result = genDefinitions(config as Config);

console.log(result);
