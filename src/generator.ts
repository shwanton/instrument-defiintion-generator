type CVGateOut = "CVG1" | "CVG2" | "CVG3" | "CVG4";
type CVOut = "CV1" | "CV2" | "CV3" | "CV4";
type GateOut = "G1" | "G2" | "G3" | "G4";
// prettier-ignore
type MIDIChannels =  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16
// prettier-ignore
type OutPorts = "A" | "B" | "C" | "D" | "USBD" | "USBH" | CVGateOut | CVOut | GateOut;
type InPorts = "NONE" | "ALLACTIVE" | "A" | "B" | "USBH" | "USBD" | "CVG";
interface DrumLane {
  number: number | ProgramChangeNumber;
  name: string;
  comment?: Comment | null;
}
type ProgramChangeNumber = string;
type Comment = string;
interface ProgramChange {
  number: number | ProgramChangeNumber;
  name: string;
  comment?: Comment | null;
}
type ProgramChanges = Array<ProgramChange> | null;
interface ControlChange {
  number: number;
  name: string;
  comment?: Comment | null;
}
type ControlChanges = Array<ControlChange> | null;
type DrumLanes = Array<DrumLane> | null;
type ModType = "CC" | "PB" | "AT" | "CV" | "NPRN";

type PotNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
interface Assignment {
  potNumber: PotNumber;
  type: ModType | null;
  value: number;
  comment?: Comment | null;
}
type Assignments = Array<Assignment> | null;
interface Automation {
  type: ModType;
  value: number | string | null;
  default: number | null;
  comment?: Comment | null;
}
type Automations = Array<Automation> | null;
interface NPRN {
  msb: number;
  lsb: number;
  depth: 7 | 14;
  name: string;
  default: number | null;
  comment?: Comment | null;
}
type NPRNs = Array<NPRN> | null;

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
  ASSIGN?: Assignments;
  AUTOMATION?: Automations;
  NPRN: NPRNs;
  COMMENT?: Comment | null;
}

function* generateDrumLane(drumLane: DrumLane): Generator<string> {
  yield `${drumLane.number} ${drumLane.name}`;

  if (drumLane.comment != null) {
    yield ` #${drumLane.comment}`;
  }
}

function* generateDrumlanes(drumLanes: DrumLanes): Generator<string> {
  yield `[DRUMLANES]`;
  yield `\n`;

  if (drumLanes == null) {
    yield `\n`;
  } else {
    for (const row of drumLanes) {
      yield* generateDrumLane(row);
      yield `\n`;
    }
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

function* generateComment(comment: Comment): Generator<string> {
  yield `[COMMENT]`;
  yield `\n`;
  yield comment;
  yield `\n`;
  yield `[/COMMENT]`;
}

function* genComment(comment: Comment): Generator<string> {
  const result = [];
  for (const row of generateComment(comment)) {
    result.push(row);
  }
  yield result.join("");
}

function* generateAssignment(assignment: Assignment): Generator<string> {
  yield `${assignment.potNumber} ${assignment.type}:${assignment.value}`;

  if (assignment.comment != null) {
    yield ` # ${assignment.comment}`;
  }
}

function* generateAssignments(assignments: Assignments): Generator<string> {
  yield `[ASSIGN]`;
  yield `\n`;

  if (assignments == null) {
    yield "\n";
  } else {
    for (const row of assignments) {
      yield* generateAssignment(row);
      yield `\n`;
    }
  }

  yield `[/ASSIGN]`;
}

function* genAssignments(assignments: Assignments): Generator<string> {
  const result = [];
  for (const row of generateAssignments(assignments)) {
    result.push(row);
  }
  yield result.join("");
}

function* generateAutomation(automation: Automation): Generator<string> {
  yield `${automation.type}:${automation.value}`;

  if (automation.default != null) {
    yield ` DEFAULT=${automation.default}`;
  }

  if (automation.comment != null) {
    yield ` # ${automation.comment}`;
  }
}

function* generateAutomations(automations: Automations): Generator<string> {
  yield `[AUTOMATION]`;
  yield `\n`;

  if (automations == null) {
    yield "\n";
  } else {
    for (const row of automations) {
      yield* generateAutomation(row);
      yield `\n`;
    }
  }

  yield `[/AUTOMATION]`;
}

function* genAutomations(automations: Automations): Generator<string> {
  const result = [];
  for (const row of generateAutomations(automations)) {
    result.push(row);
  }
  yield result.join("");
}

function* generateNPRN(nprn: NPRN): Generator<string> {
  yield `${nprn.msb}:${nprn.lsb}:${nprn.depth} ${nprn.name}`;

  if (nprn.default != null) {
    yield ` DEFAULT_VALUE=${nprn.default}`;
  }

  if (nprn.comment != null) {
    yield ` # ${nprn.comment}`;
  }
}

function* generateNPRNs(nprns: NPRNs): Generator<string> {
  yield `[NRPN]`;
  yield `\n`;

  if (nprns == null) {
    yield "\n";
  } else {
    for (const row of nprns) {
      yield* generateNPRN(row);
      yield `\n`;
    }
  }

  yield `[/NRPN]`;
}

function* genNPRNs(nprns: NPRNs): Generator<string> {
  const result = [];
  for (const row of generateNPRNs(nprns)) {
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

  if (config.NPRN != null) {
    yield* genNPRNs(config.NPRN);
  }

  if (config.ASSIGN != null) {
    yield* genAssignments(config.ASSIGN);
  }

  if (config.AUTOMATION != null) {
    yield* genAutomations(config.AUTOMATION);
  }

  if (config.COMMENT != null) {
    yield* genComment(config.COMMENT);
  }
}

export function genDefinitionString(config: Config): string {
  const result = [];
  for (const row of generateContent(config)) {
    result.push(row);
  }

  return result.join(`\n\n`) + `\n`;
}

export function genDefinitions(config: Config): string {
  return genDefinitionString(config); /*?*/
}
