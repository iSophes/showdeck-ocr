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
    });

    if (!answer) {
      return;
    }
  }

  cueManager.removeAllCues();
  const projectFilePath = await getProjectFilePath();

  if (!projectFilePath) {
    return;
  }

  const parsedFile = await readTextFile(projectFilePath);
  const Json = JSON.parse(parsedFile);
  console.log(Json);
  for (var x in Json) {
    let currentEnum = cueTypeEnum[Json[x].cueType as keyof typeof cueTypeEnum];
    cueManager.addCue(currentEnum, Json[x].cueName, Json[x].extraData);
  }
}
