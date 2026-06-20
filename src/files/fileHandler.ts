import { open, ask } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { CueManager, cueTypeEnum } from "../cues/cuemanager";
let unsavedFile = true;

export async function saveProject() {
  // Saves currently loaded file, otherwise does a "save as"
}

export async function saveProjectAs() {
  // "Save As" feature
}

async function getMediaFilePath(): Promise<string> {
  // Returns a file path for media
  return "";
}

async function getProjectFilePath(): Promise<string> {
  // Returns file path of a showdeck project
  const file = await open({
    multiple: false,
    directory: false,
    filters: [
      {
        name: "Showdeck Files",
        extensions: ["showdeck"],
      },
    ],
  });

  return file ? file : ""; // return file or an empty string
}

export async function loadMedia() {
  // Loads media

  return;
}

export async function loadProject(cueManager: CueManager) {
  // Loads a project

  if (unsavedFile) {
    const answer = await ask("You have unsaved changes, are you sure?", {
      title: "Showdeck",
      kind: "warning",
    }); // warns if we have unsaved changes

    if (!answer) {
      return; // stop if we dont want to load a new file
    }
  }

  const projectFilePath = await getProjectFilePath(); // gets the project we want to load

  if (!projectFilePath) {
    return; // don't do anything if we dont have a valid project
  }

  cueManager.removeAllCues(); // removes cues in current stack

  const parsedFile = await readTextFile(projectFilePath); // reads our file
  const Json = JSON.parse(parsedFile); // parses to dictionary

  for (var x in Json) {
    let currentEnum = cueTypeEnum[Json[x].cueType as keyof typeof cueTypeEnum]; // gets the current cue type
    cueManager.addCue(currentEnum, Json[x].cueName, Json[x].extraData); // add the cue
  }
}
