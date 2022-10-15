interface Config {
  VERSION: number;
}

// interface State {
//   downloadType: number;
// }

export function* generateContent(config: Config): Generator<string> {
  yield `VERSION ${config.VERSION}`;
  yield `TRACKNAME NULL`;
  yield `TYPE NULL`;
  yield `OUTPORT NULL`;
  yield `OUTCHAN NULL`;
  yield `INPORT NULL`;
  yield `INCHAN NULL`;
  yield `[DRUMLANES]\n[/DRUMLANES]`;
  yield `[PC]\n[/PC]`;
  yield `[CC]\n[/CC]`;
  yield `[NRPN]\n[/NRPN]`;
  yield `[ASSIGN]\n[/ASSIGN]`;
  yield `[AUTOMATION]\n[/AUTOMATION]`;
  yield `[COMMENT]\n[/COMMENT]`;
}

export function genSysex(config: Config): string {
  const result = [];
  for (const message of generateContent(config)) {
    result.push(message);
  }

  return result.join("\n\n");
}

export function getDefinitions(): string {
  return genSysex({ VERSION: 1 }); /*?*/
}
