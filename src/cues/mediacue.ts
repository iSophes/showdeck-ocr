import { invoke } from "@tauri-apps/api/core";
import { Cue, CueInterface } from "./cue";
import { CueManager } from "./cuemanager";

export interface MediaCueInterface extends CueInterface {
  filePath: string;
  mediaSource: unknown;
}

export class MediaCue extends Cue {
  // Inherit from cue!

  filePath: string;
  mediaSource: unknown;
  constructor(
    id: number,
    name: string,
    preWait: number,
    postWait: number,
    next: string,
    filePath: string,
    cueManager: CueManager,
  ) {
    super(id, name, preWait, postWait, next, cueManager); // Create a regular cue.
    this.filePath = filePath; // Give it a file path.
    this.mediaSource = null;
  }

  async startCue() {
    super.startCue(); // Start the cue

    let filePath = this.filePath;
    if (filePath[0] === "/") {
      filePath = filePath.slice(1); // removes the first slash from linux
    }

    invoke("play_audio", {
      id: this.id.toString(),
      uri: `file:///${filePath.replace(/\\/g, "/").replace(/ /g, "%20")}`, // removes back slashes to forwards slashes and encodes spaces correctly
    });
  }

  async destroyCue() {
    super.destroyCue();
    this.mediaSource = null;
  }
}
