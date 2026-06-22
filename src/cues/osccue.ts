import { invoke } from "@tauri-apps/api/core";
import { Cue } from "./cue";
import { CueManager } from "./cuemanager";
import { getIP } from "../config";

export class OSCCue extends Cue {
  // Inherit from cue!

  command: string;
  constructor(
    id: number,
    name: string,
    preWait: number,
    postWait: number,
    next: string,
    command: string,
    cueManager: CueManager,
  ) {
    super(id, name, preWait, postWait, next, cueManager); // Create a regular cue.
    this.command = command;

    if (!command) {
      this.command = "";
    }
  }

  async startCue() {
    super.startCue(); // Start the cue

    let split = getIP().split(":");

    invoke("fire_osc", {
      oscCommand: this.command,
      address: split[0],
      port: Number(split[1]),
    }); // fires a command in rust

    super.endCue(); // immediately end
  }
}
