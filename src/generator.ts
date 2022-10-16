type CVGateOut = "CVG1" | "CVG2" | "CVG3" | "CVG4";
type CVOut = "CV1" | "CV2" | "CV3" | "CV4";
type GateOut = "G1" | "G2" | "G3" | "G4";
// prettier-ignore
type MIDIChannels =  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16
// prettier-ignore
type OutPorts = "A" | "B" | "C" | "D" | "USBD" | "USBH" | CVGateOut | CVOut | GateOut;
type InPorts = "NONE" | "ALLACTIVE" | "A" | "B" | "USBH" | "USBD" | "CVG";
type DrumLanes = Array<string> | null;
type ProgramChangeNumber = string;
interface ProgramChange {
  number: number | ProgramChangeNumber;
  name: string;
  comment: string | null;
}
type ProgramChanges = Array<ProgramChange> | null;
interface ControlChange {
  number: number;
  name: string;
  comment: string | null;
}
type ControlChanges = Array<ControlChange> | null;

export interface Config {
  VERSION: 1;
  TRACKNAME: string | null;
  TYPE: "POLY" | "DRUM" | "MPE" | null;
  OUTPORT: OutPorts | null;
  OUTCHAN: MIDIChannels | null;
  INPORT: InPorts | null;
  INCHAN: MIDIChannels | "ALL" | null;
  DRUMLANES: DrumLanes;
  PC: ProgramChanges;
  CC: ControlChanges;
}

function* generateDrumlanes(drumlanes: DrumLanes): Generator<string> {
  yield `[DRUMLANES]`;

  if (drumlanes == null) {
    yield "\n";
  }

  yield `[/DRUMLANES]`;
}

function* genDrums(drumLanes: DrumLanes): Generator<string> {
  const result = [];
  for (const row of generateDrumlanes(drumLanes)) {
    result.push(row);
  }
  yield result.join("");
}

function* generateProgramChange(
  programChange: ProgramChange
): Generator<string> {
  yield `${programChange.number} ${programChange.name}`;

  if (programChange.comment != null) {
    yield ` #${programChange.comment}`;
  }
}

function* generateProgramChanges(
  programChanges: ProgramChanges
): Generator<string> {
  yield `[PC]`;
  yield `\n`;

  if (programChanges == null) {
    yield "\n";
  } else {
    for (const pc of programChanges) {
      yield* generateProgramChange(pc);
      yield `\n`;
    }
  }

  yield `[/PC]`;
}

function* genProgramChanges(programChanges: ProgramChanges): Generator<string> {
  const result = [];
  for (const row of generateProgramChanges(programChanges)) {
    result.push(row);
  }
  yield result.join("");
}

function* generateControlChange(
  controlChange: ControlChange
): Generator<string> {
  yield `${controlChange.number} ${controlChange.name}`;

  if (controlChange.comment != null) {
    yield ` #${controlChange.comment}`;
  }
}

function* generateControlChanges(
  controlChanges: ControlChanges
): Generator<string> {
  yield `[CC]`;
  yield `\n`;

  if (controlChanges == null) {
    yield "\n";
  } else {
    for (const row of controlChanges) {
      yield* generateControlChange(row);
      yield `\n`;
    }
  }

  yield `[/CC]`;
}

function* genControlChanges(controlChanges: ControlChanges): Generator<string> {
  const result = [];
  for (const row of generateControlChanges(controlChanges)) {
    result.push(row);
  }
  yield result.join("");
}

export function* generateContent(config: Config): Generator<string> {
  yield `VERSION ${config.VERSION}`;
  yield `TRACKNAME ${config.TRACKNAME ?? "NULL"}`;
  yield `TYPE ${config.TYPE ?? "NULL"}`;
  yield `OUTPORT ${config.OUTPORT ?? "NULL"}`;
  yield `OUTCHAN ${config.OUTCHAN ?? "NULL"}`;
  yield `INPORT ${config.INPORT ?? "NULL"}`;
  yield `INCHAN ${config.INCHAN ?? "NULL"}`;

  if (config.DRUMLANES != null) {
    yield* genDrums(config.DRUMLANES);
  }

  if (config.PC != null) {
    yield* genProgramChanges(config.PC);
  }

  if (config.CC != null) {
    yield* genControlChanges(config.CC);
  }

  yield `[NRPN]\n[/NRPN]`;
  yield `[ASSIGN]\n[/ASSIGN]`;
  yield `[AUTOMATION]\n[/AUTOMATION]`;
  yield `[COMMENT]\n[/COMMENT]`;
}

export function genDefinitionString(config: Config): string {
  const result = [];
  for (const message of generateContent(config)) {
    result.push(message);
  }

  return result.join("\n\n");
}

export function genDefinitions(config: Config): string {
  return genDefinitionString(config); /*?*/
}
