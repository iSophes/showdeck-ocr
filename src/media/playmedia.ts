import { appDataDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";

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

export async function playMedia(path: string): Promise<boolean> {
  const filePath = await join(appDataDirPath, path); // Get our file
  const assetUrl = convertFileSrc(filePath); // Turn it into a usable URL.

  const video: HTMLElement | null = document.getElementById("my-video"); // Get the video handler in our app.

  if (!video) {
    return false;
  } // Edge case for types, it will never actually be nil.

  const typedVideo: any = video; // Type to any so we don't get annoying errors when running below code.

  typedVideo.src = assetUrl;
  typedVideo.load(); // Load the video
  typedVideo.play(); // Play it!

  return true;
}
