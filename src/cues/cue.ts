import { Signal } from "@soncodi/signal"; // Signal library so we can have signals.

export enum CueState {
  Inactive = "Inactive",
  Playing = "Playing",
  Paused = "Paused",
  Ended = "Ended",
} // Enum for types of cue state

export class Cue {
  id: number;
  name: string;
  status: CueState;
  preWait: number;
  postWait: number;

  updateCueStateSignal: Signal<CueState>;

  constructor(id: number, name: string) {
    this.id = id; // Unique identifier for cues
    this.name = name; // Name for the cues
    this.status = CueState.Inactive; // Status on our cue, what is it doing?
    this.preWait = 0; // How long to wait until running the cue after pressing go?
    this.postWait = 0; // How long to wait after running the cue until the next cue? (I.E: when on auto-next)

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
  }
} // Superclass that all our cue types will inherit from
