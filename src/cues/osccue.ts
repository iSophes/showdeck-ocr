import {Client} from "node-osc"
import { Cue } from "./cue";

const client = new Client('127.0.0.1', 3333);

export class OSCCue extends Cue {
  // Inherit from cue!

  command: string;
  constructor(id: number, name: string, command: string) {
    super(id, name); // Create a regular cue.
    this.command = command;

    if (!command) {
      this.command = ""
    }
  }

  async startCue() {
    super.startCue(); // Start the cue
    client.send(this.command, 200);
  }
}
