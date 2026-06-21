import { Signal } from "@soncodi/signal";
import { CueInterface, CueState } from "./cue";
import { MediaCue } from "./mediacue";
import { OSCCue } from "./osccue";
import { invoke } from "@tauri-apps/api/core";
export enum cueTypeEnum {
  "Media" = "Media",
  "OSC" = "OSC",
}

function sortCues(cues: CueInterface[]): CueInterface[] {
  return cues.sort((a, b) => a.id - b.id); // Generic sorting in ascending order
}

export class CueManager {
  cues: CueInterface[];
  activeCues: CueInterface[];

  cueSignals: { [key: string]: Signal[] };

  preWaitPanicSignal: Signal;
  regularPanicSignal: Signal;
  selectedCue: number;

  constructor() {
    // creates a cuemanager
    this.cues = []; // cues can be an array
    this.activeCues = [];
    this.cueSignals = {};
    this.preWaitPanicSignal = new Signal();
    this.regularPanicSignal = new Signal();
    this.selectedCue = 0; // Index starts at 0
  }

  addCue(
    // creates a new cue for our cue manager.
    cueType: cueTypeEnum,
    cueName: string,
    preWait: number,
    postWait: number,
    next: string,
    extraData: Partial<{ filePath: string; oscCommand: string }>,
    cueManager: CueManager,
  ) {
    let newCue;
    if (cueType == cueTypeEnum.Media) {
      newCue = new MediaCue(
        this.cues.length,
        cueName,
        preWait,
        postWait,
        next,
        extraData.filePath ? extraData.filePath : "",
        cueManager,
      );
    }

    if (cueType == cueTypeEnum.OSC) {
      newCue = new OSCCue(
        this.cues.length,
        cueName,
        preWait,
        postWait,
        next,
        extraData.oscCommand ? extraData.oscCommand : "",
        cueManager,
      );
    }

    if (!newCue) {
      return;
    }

    this.cues[newCue.id] = newCue;
    sortCues(this.cues);

    this.cueSignals[newCue.id.toString()] = [];
  }

  removeAllCues() {
    for (var cue of this.cues) {
      cue.destroyCue();
    }

    this.cues = [];
  }

  removeCue(cueId: number) {
    // removes a specific cue from the manager
    // NOTE: Do we need to resort at the end?

    sortCues(this.cues); // sort it in order first in case we aren't in order

    for (var cue in this.cues) {
      if (this.cues[cue].id == cueId) {
        this.cues[cue].destroyCue();
      }
    }

    this.cues = this.cues.filter((cue) => {
      return cue.id !== cueId;
    });

    sortCues(this.cues); // resort
  }

  getCueById(cueId: number) {
    // gets a cue by id
    let cue = this.cues[cueId];

    return cue;
  }

  previousCue() {
    if (this.selectedCue == 0) {
      this.selectedCue = this.cues.length - 1; // Get last cue in manager if we are at the start of the list
      return; // return once we get it so we dont go back again
    }

    this.selectedCue -= 1; // go to previous cue
  }

  async playCue(cueId: number) {
    // play our cue by id
    if (cueId < 0) {
      // if we don't have one selected, select the first cue
      cueId = 0;
    }

    let cue = this.getCueById(cueId); // get our actual cue
    this.selectedCue += 1; // move play head forward to next cue
    console.log(this.selectedCue);

    if (cue.next == "with") {
      this.playCue(this.selectedCue);
    }

    if (cue.preWait > 0) {
      let cancelled = false;

      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          console.log("preWait ms:", cue.preWait * 1000);
          preWaitPanicSignalConnection.off();
          resolve();
        }, cue.preWait * 1000);
        console.log("registering preWaitPanicSignal listener");
        const preWaitPanicSignalConnection = this.preWaitPanicSignal.on(() => {
          preWaitPanicSignalConnection.off();
          cancelled = true;
          clearTimeout(timeout);
          resolve();
        });
      });

      if (cancelled) {
        console.log("cancel!");
        return false;
      }
    }

    if (!cue) {
      return false;
    } // Check for types, will most likely always exist.

    cue.startCue(); // start our cue

    if (!this.activeCues[cue.id]) {
      this.activeCues.push(cue);
    } // make it active

    if (this.selectedCue == this.cues.length) {
      this.selectedCue = 0; // go back to start of the queue if we hit the end of it
    }

    if (cue.next === "after") {
      let regularPanic: ReturnType<typeof this.regularPanicSignal.once> | null =
        null;
      let stateChange: ReturnType<typeof cue.updateCueStateSignal.on> | null =
        null;

      if (cue.status === CueState.Ended || cue.status == CueState.Inactive) {
        this.playCue(this.selectedCue);
        return;
      }

      stateChange = cue.updateCueStateSignal.on((state: CueState) => {
        if (state === CueState.Ended || state == CueState.Inactive) {
          this.playCue(this.selectedCue);
          regularPanic?.off();
          stateChange?.off();
          return;
        }
      });

      regularPanic = this.regularPanicSignal.once(() => {
        stateChange?.off();
        return;
      });
    }

    return true;
  }

  pauseCue(cueId: number) {
    let cue = this.getCueById(cueId);

    if (!cue) {
      return;
    }

    cue.pauseCue();
  }

  panicCues() {
    invoke("panic_audio");
    console.log("preWaitPanicSignal:", this.preWaitPanicSignal);
    console.log("active cues:", this.activeCues);
    this.preWaitPanicSignal.emit();
    this.regularPanicSignal.emit();

    for (var cue of this.activeCues) {
      cue.endCue();

      for (var signal of this.cueSignals[cue.id.toString()]) {
        signal.off();
      }
    }
    this.activeCues = [];

    this.selectedCue = 0; // deselect everything
  }

  panicNext() {
    let currentSelected = this.selectedCue;
    this.panicCues();
    this.selectedCue = currentSelected;
  }
}
