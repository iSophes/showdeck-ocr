import { Signal } from "@soncodi/signal"; // Signal library so we can have signals.
import { CueManager } from "./cuemanager";

export enum CueState {
  Inactive = "Inactive",
  Playing = "Playing",
  Paused = "Paused",
  Ended = "Ended",
} // Enum for types of cue state

export interface CueInterface {
  id: number;
  name: string;
  status: CueState;
  preWait: number;
  postWait: number;
  next: string;

  CueManager: CueManager;

  startCue(): void;
  pauseCue(): void;
  endCue(): void;
  destroyCue(): void;

  updateCueStateSignal: Signal<CueState>;
  signals: Signal<CueState>[];
}

export class Cue implements CueInterface {
  id: number;
  name: string;
  status: CueState;
  preWait: number;
  postWait: number;
  next: string;
  signals: Signal<CueState>[];
  CueManager: CueManager;

  updateCueStateSignal: Signal<CueState>;

  constructor(
    id: number,
    name: string,
    preWait: number,
    postWait: number,
    next: string,
    cueManager: CueManager,
  ) {
    this.id = id; // Unique identifier for cues
    this.name = name; // Name for the cues
    this.status = CueState.Inactive; // Status on our cue, what is it doing?
    this.preWait = preWait; // How long to wait until running the cue after pressing go?
    this.postWait = postWait; // How long to wait after running the cue until the next cue? (I.E: when on auto-next)
    this.next = next;
    this.signals = [];
    this.CueManager = cueManager;
    this.updateCueStateSignal = new Signal();
  }

  startCue() {
    this.status = CueState.Playing; // Play the cue!
    this.updateCueStateSignal.emit(CueState.Playing);
  }

  pauseCue() {
    this.status = CueState.Paused; // Pause it!
    this.updateCueStateSignal.emit(CueState.Paused);
  }

  endCue() {
    this.status = CueState.Ended; // We're ending. Could be the end of a cue or a panic.
    this.updateCueStateSignal.emit(CueState.Ended);

    this.status = CueState.Inactive; // When a cue ends, it will be inactive so we set it to this.
    this.updateCueStateSignal.emit(CueState.Inactive);

    for (let signal of this.signals) {
      signal.off();
    }
  }

  destroyCue(): void {
    for (let signal of this.signals) {
      signal.off();
    }
  }
} // Superclass that all our cue types will inherit from
