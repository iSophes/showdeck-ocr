import { open } from "@tauri-apps/plugin-dialog";

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

export async function loadProject() {
  // Loads a project

  const projectFilePath = await getProjectFilePath();

  if (!projectFilePath) {
    return;
  }
}
