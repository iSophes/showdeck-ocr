import { Signal } from "@soncodi/signal";
import { CueInterface } from "./cue";
import { MediaCue } from "./mediacue";
import { endMedia } from "../media/playmedia";

export enum cueTypeEnum {
  "Media" = "Media",
}

function sortCues(cues: CueInterface[]): CueInterface[] {
  return cues.sort((a, b) => a.id - b.id); // Generic sorting in ascending order
}

export class CueManager {
  cues: CueInterface[];
  activeCues: CueInterface[];

  cueSignals: { [key: string]: Signal[] };

  selectedCue: number;

  constructor() {
    // creates a cuemanager
    this.cues = []; // cues can be an array
    this.activeCues = [];
    this.cueSignals = {};

    this.selectedCue = 0; // Index starts at 0
  }

  addCue(
    // creates a new cue for our cue manager.
    cueType: cueTypeEnum,
    cueName: string,
    extraData: { filePath: string },
  ) {
    if (cueType == cueTypeEnum.Media) {
      let newCue = new MediaCue(this.cues.length, cueName, extraData.filePath);
      this.cues[newCue.id] = newCue;
      sortCues(this.cues);

      this.cueSignals[newCue.id.toString()] = [];

      console.log(this.cues);
    }
  }

  removeCue(cueId: number) {
    // removes a specific cue from the manager
    // NOTE: Do we need to resort at the end?

    sortCues(this.cues); // sort it in order first in case we aren't in order
    this.cues = this.cues.filter((cue) => {
      return cue.id !== cueId;
    }); // keeps everything that doesn't have our cue id
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

  playCue(cueId: number) {
    // play our cue by id
    if (cueId < 0) {
      // if we don't have one selected, select the first cue
      cueId = 0;
    }

    let cue = this.getCueById(cueId); // get our actual cue

    if (!cue) {
      return;
    } // Check for types, will most likely always exist.

    this.selectedCue += 1; // move play head forward to next cue
    cue.startCue(); // start our cue
    if (!this.activeCues[cue.id]) {
      this.activeCues.push(cue);
    } // make it active

    if (this.selectedCue == this.cues.length) {
      this.selectedCue = 0; // go back to start of the queue if we hit the end of it
    }
  }

  pauseCue(cueId: number) {
    let cue = this.getCueById(cueId);

    if (!cue) {
      return;
    }

    cue.pauseCue();
  }

  panicCues() {
    console.log("panic");
    for (var cue of this.activeCues) {
      console.log("cue");
      cue.endCue();
      endMedia();

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
