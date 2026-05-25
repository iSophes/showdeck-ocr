import { appDataDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";
const appDataDirPath = await appDataDir(); // Get appdata
const filePath = await join(appDataDirPath, "assets/dishes.mp3"); // Get our file
const assetUrl = convertFileSrc(filePath); // Turn it into a usable URL.

export function PlayMedia() {
  const video: HTMLElement | null = document.getElementById("my-video"); // Get the video handler in our app.

  if (!video) {
    return;
  } // Edge case for types, it will never actually be nil.

  let typedVideo: any = video; // Type to any so we don't get annoying errors when running below code.

  const source = document.createElement("source"); // Create a source
  source.type = "audio/mpeg"; // Set type to one that can play audio (and video for some reason)
  source.src = assetUrl; // Set it to our url
  typedVideo.appendChild(source); // Give the source to our video box
  typedVideo.load(); // Load the video
  typedVideo.play(); // Play it!
}
