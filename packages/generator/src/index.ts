import { type Config, genDefinitionText } from "./generator";

import config from "../../../configs/circuit_tracks.json";

const result = genDefinitionText(config as Config);

console.log(result);
