import { open, ask } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { CueManager, cueTypeEnum } from "../cues/cuemanager";
let unsavedFile = false;

/*export async function saveProject() {
  // Saves currently loaded file, otherwise does a "save as"
}

export async function saveProjectAs() {
  // "Save As" feature
}

async function getMediaFilePath(): Promise<string> {
  // Returns a file path for media
  return "";
}
*/
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

/*export async function loadMedia() {
  // Loads media

  return;
}
*/
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

  const split_string =
    projectFilePath.split("\\").length > 0
      ? projectFilePath.split("\\")
      : projectFilePath.split("/"); // make an array of all the elements that make up our string. windows uses back slashes, macos and linux use forward ones

  cueManager.constants?.setFile(split_string[split_string.length - 1]); // get last index of array with our file name and set it.

  for (var x in Json) {
    let currentEnum = cueTypeEnum[Json[x].cueType as keyof typeof cueTypeEnum]; // gets the current cue type
    let preWait = Json[x].prewait ? Json[x].prewait : 0;
    let postWait = Json[x].postwait ? Json[x].postwait : 0;

    let next = Json[x].next ? Json[x].next : "manually";
    cueManager.addCue(
      currentEnum,
      Json[x].name,
      preWait,
      postWait,
      next,
      Json[x].extraData,
      cueManager,
    ); // add the cue
  }
}
