type CVGateOut = `CVG1` | `CVG2` | `CVG3` | `CVG4`;
type CVOut = `CV1` | `CV2` | `CV3` | `CV4`;
type GateOut = `G1` | `G2` | `G3` | `G4`;
// prettier-ignore
type MIDIChannels =  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16
// prettier-ignore
type OutPorts = `A` | `B` | `C` | `D` | `USBD` | `USBH` | CVGateOut | CVOut | GateOut;
type InPorts = `NONE` | `ALLACTIVE` | `A` | `B` | `USBH` | `USBD` | `CVG`;
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
type ModType = `CC` | `PB` | `AT` | `CV` | `NPRN`;
type PotNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type MaybeComment = Comment | null;

interface Assignment {
  potNumber: PotNumber;
  type: ModType | null;
  value: number;
  comment?: MaybeComment;
}
type Assignments = Array<Assignment> | null;
interface Automation {
  type: ModType;
  value: number | string | null;
  default: number | null;
  comment?: MaybeComment;
}
type Automations = Array<Automation> | null;
interface NPRN {
  msb: number;
  lsb: number;
  depth: 7 | 14;
  name: string;
  default: number | null;
  comment?: MaybeComment;
}
type NPRNs = Array<NPRN> | null;
type GeneratorFn<T> = (data: T) => Generator<string>;
type MaybeStringGenerator = Generator<string | null>;

// Add hardware
// Add version
// Add unique id
// Add username?
// Zod?
// JSON schema?
export interface Config {
  VERSION: 1;
  TRACKNAME: string | null;
  TYPE: `POLY` | `DRUM` | `MPE` | null;
  OUTPORT: OutPorts | null;
  OUTCHAN: MIDIChannels | null;
  INPORT: InPorts | null;
  INCHAN: MIDIChannels | `ALL` | null;
  DRUMLANES: DrumLanes;
  PC: ProgramChanges;
  CC: ControlChanges;
  ASSIGN: Assignments;
  AUTOMATION: Automations;
  NPRN: NPRNs;
  COMMENT: MaybeComment;
}

export interface State {
  showEmptySections: boolean;
}

function* genDrumLane(drumLane: DrumLane): Generator<string> {
  yield `${drumLane.number} ${drumLane.name}`;

  if (drumLane.comment != null) {
    yield ` #${drumLane.comment}`;
  }
}

function* genDrumlanes(drumLanes: DrumLanes): Generator<string> {
  yield `[DRUMLANES]`;
  yield `\n`;

  if (drumLanes == null) {
    yield ``;
  } else {
    for (const row of drumLanes) {
      yield* genDrumLane(row);
      yield `\n`;
    }
  }

  yield `[/DRUMLANES]`;
}

function* genProgramChange(programChange: ProgramChange): Generator<string> {
  yield `${programChange.number} ${programChange.name}`;

  if (programChange.comment != null) {
    yield ` #${programChange.comment}`;
  }
}

function* genProgramChanges(programChanges: ProgramChanges): Generator<string> {
  yield `[PC]`;
  yield `\n`;

  if (programChanges == null) {
    yield ``;
  } else {
    for (const pc of programChanges) {
      yield* genProgramChange(pc);
      yield `\n`;
    }
  }

  yield `[/PC]`;
}

function* genControlChange(controlChange: ControlChange): Generator<string> {
  yield `${controlChange.number} ${controlChange.name}`;

  if (controlChange.comment != null) {
    yield ` #${controlChange.comment}`;
  }
}

function* genControlChanges(controlChanges: ControlChanges): Generator<string> {
  yield `[CC]`;
  yield `\n`;

  if (controlChanges == null) {
    yield ``;
  } else {
    for (const row of controlChanges) {
      yield* genControlChange(row);
      yield `\n`;
    }
  }

  yield `[/CC]`;
}

function* genAssignment(assignment: Assignment): Generator<string> {
  yield `${assignment.potNumber} ${assignment.type}:${assignment.value}`;

  if (assignment.comment != null) {
    yield ` # ${assignment.comment}`;
  }
}

function* genAssignments(assignments: Assignments): Generator<string> {
  yield `[ASSIGN]`;
  yield `\n`;

  if (assignments == null) {
    yield ``;
  } else {
    for (const row of assignments) {
      yield* genAssignment(row);
      yield `\n`;
    }
  }

  yield `[/ASSIGN]`;
}

function* genAutomation(automation: Automation): Generator<string> {
  yield `${automation.type}:${automation.value}`;

  if (automation.default != null) {
    yield ` DEFAULT=${automation.default}`;
  }

  if (automation.comment != null) {
    yield ` # ${automation.comment}`;
  }
}

function* genAutomations(automations: Automations): Generator<string> {
  yield `[AUTOMATION]`;
  yield `\n`;

  if (automations == null) {
    yield ``;
  } else {
    for (const row of automations) {
      yield* genAutomation(row);
      yield `\n`;
    }
  }

  yield `[/AUTOMATION]`;
}

function* genNPRN(nprn: NPRN): Generator<string> {
  yield `${nprn.msb}:${nprn.lsb}:${nprn.depth} ${nprn.name}`;

  if (nprn.default != null) {
    yield ` DEFAULT_VALUE=${nprn.default}`;
  }

  if (nprn.comment != null) {
    yield ` # ${nprn.comment}`;
  }
}

function* genNPRNs(nprns: NPRNs): Generator<string> {
  yield `[NRPN]`;
  yield `\n`;

  if (nprns == null) {
    yield ``;
  } else {
    for (const row of nprns) {
      yield* genNPRN(row);
      yield `\n`;
    }
  }

  yield `[/NRPN]`;
}

function* genComment(comment: Comment | null): Generator<string> {
  yield `[COMMENT]`;
  yield `\n`;
  if (comment !== null) {
    yield comment;
    yield `\n`;
  }
  yield `[/COMMENT]`;
}

function genRowsWithState(
  state: State
): <T>(rows: T, generatorFn: GeneratorFn<T>) => MaybeStringGenerator {
  const { showEmptySections } = state;

  return function* <T>(
    rows: T,
    generatorFn: GeneratorFn<T>
  ): MaybeStringGenerator {
    if (showEmptySections === false && rows == null) {
      return yield null;
    }

    const result = [];
    for (const row of generatorFn(rows)) {
      result.push(row);
    }

    yield result.join(``);
  };
}

export function* genTextRows(
  config: Config,
  state: State
): Generator<string | null> {
  yield `VERSION ${config.VERSION}`;
  yield `TRACKNAME ${config.TRACKNAME ?? `NULL`}`;
  yield `TYPE ${config.TYPE ?? `NULL`}`;
  yield `OUTPORT ${config.OUTPORT ?? `NULL`}`;
  yield `OUTCHAN ${config.OUTCHAN ?? `NULL`}`;
  yield `INPORT ${config.INPORT ?? `NULL`}`;
  yield `INCHAN ${config.INCHAN ?? `NULL`}`;

  const genRows = genRowsWithState(state);

  yield* genRows<DrumLanes>(config.DRUMLANES, genDrumlanes);
  yield* genRows<ProgramChanges>(config.PC, genProgramChanges);
  yield* genRows<ControlChanges>(config.CC, genControlChanges);
  yield* genRows<NPRNs>(config.NPRN, genNPRNs);
  yield* genRows<Assignments>(config.ASSIGN, genAssignments);
  yield* genRows<Automations>(config.AUTOMATION, genAutomations);
  yield* genRows<MaybeComment>(config.COMMENT, genComment);
}

export function genDefinitionText(config: Config, state: State): string {
  const result = [];
  for (const row of genTextRows(config, state)) {
    row != null && result.push(row);
  }

  return result.join(`\n\n`) + `\n`;
}
