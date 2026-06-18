import { invoke } from "@tauri-apps/api/core";
import { Cue } from "./cue";

export class OSCCue extends Cue {
  // Inherit from cue!

  command: string;
  constructor(id: number, name: string, command: string) {
    super(id, name); // Create a regular cue.
    this.command = command;

    if (!command) {
      this.command = "";
    }
  }

  async startCue() {
    super.startCue(); // Start the cue

    invoke("fire_osc", {
      oscCommand: this.command,
      address: "127.0.0.1", // 192.168.200.1
      port: 8000,
    }); // fires a command in rust
  }
}
