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
    this.cues = []; // cues can be an array
    this.activeCues = [];
    this.cueSignals = {};

    this.selectedCue = 0; // Index starts at 0
  }

  addCue(
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
    sortCues(this.cues);
    this.cues = this.cues.filter((cue) => {
      return cue.id !== cueId;
    });
    sortCues(this.cues);
  }

  getCueById(cueId: number) {
    let cue = this.cues[cueId];
    console.log(cue);

    return cue;
  }

  previousCue() {
    if (this.selectedCue == 0) {
      this.selectedCue = this.cues.length - 1;
      return;
    }

    this.selectedCue -= 1;
  }

  playCue(cueId: number) {
    console.log(cueId);

    if (cueId < 0) {
      cueId = 0;
    }

    let cue = this.getCueById(cueId);
    console.log(cue.name);

    if (!cue) {
      return;
    } // Check for types, will most likely always exist.

    cue.startCue();
    if (!this.activeCues[cue.id]) {
      this.activeCues.push(cue);
    }

    this.selectedCue += 1;

    if (this.selectedCue == this.cues.length) {
      this.selectedCue = 0;
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

    this.selectedCue = -1; // deselect everything
  }

  panicNext() {
    let currentSelected = this.selectedCue;
    this.panicCues();
    this.selectedCue = currentSelected;
  }
}
