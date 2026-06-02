import { playMedia } from "../media/playmedia";
import { Cue } from "./cue";

export class MediaCue extends Cue {
  // Inherit from cue!

  filePath: string;
  constructor(id: number, name: string, filePath: string) {
    super(id, name); // Create a regular cue.
    this.filePath = filePath; // Give it a file path.
  }

  async startCue() {
    super.startCue(); // Start the cue
    await playMedia(this.filePath); // Play some media!
  }
}
