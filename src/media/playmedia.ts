import { appDataDir, join } from "@tauri-apps/api/path";
import { readFile } from "@tauri-apps/plugin-fs";
import { CueInterface } from "../cues/cue";
import { MediaCue, MediaCueInterface } from "../cues/mediacue";

const appDataDirPath = await appDataDir(); // Get appdata

export async function pauseMedia(): Promise<boolean> {
  const video: HTMLElement | null = document.getElementById("my-video"); // Get the video handler in our app.
  const typedVideo: any = video; // Type to any so we don't get annoying errors when running below code.

  typedVideo.pause();

  return true;
}

export async function endMedia() {
  const video: HTMLElement | null = document.getElementById("my-video"); // Get the video handler in our app.
  const typedVideo: any = video; // Type to any so we don't get annoying errors when running below code.

  typedVideo.pause();
  typedVideo.src = "";
  typedVideo.load();

  return true;
}

export function unpauseMedia() {
  const video: HTMLElement | null = document.getElementById("my-video"); // Get the video handler in our app.
  const typedVideo: any = video; // Type to any so we don't get annoying errors when running below code.

  typedVideo.play();

  return true;
}
