import { invoke } from "@tauri-apps/api/core";
import { Cue, CueInterface } from "./cue";

export interface MediaCueInterface extends CueInterface {
  filePath: string;
  mediaSource: unknown;
}

export class MediaCue extends Cue {
  // Inherit from cue!

  filePath: string;
  mediaSource: unknown;
  constructor(id: number, name: string, filePath: string) {
    super(id, name); // Create a regular cue.
    this.filePath = filePath; // Give it a file path.
    this.mediaSource = null;
  }

  async startCue() {
    super.startCue(); // Start the cue
    invoke("play_audio", {
      id: this.id.toString(),
      uri: `file://${this.filePath}`,
    });
  }

  async destroyCue() {
    super.destroyCue();
    this.mediaSource = null;
  }
}
