import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
const appWindow = getCurrentWindow();

export enum titleButtonType {
  "Close" = "Close",
  "WinMax" = "WinMax", // Maximised or windowed button
  "Minimise" = "Minimise",
}

async function clickButton(button: titleButtonType) {
  if (button === titleButtonType.Close) {
    appWindow.close();
  }

  if (button === titleButtonType.WinMax) {
    let isMaximised = await appWindow.isMaximized();
    if (isMaximised) {
      appWindow.unmaximize();
    } else {
      appWindow.maximize();
    }
  }

  if (button == titleButtonType.Minimise) {
    appWindow.minimize();
  }
}

export function TitleButton(button: titleButtonType) {
  //  is window

  let [isMaximised, setIsMaximised] = useState(true);
  let text = "\uE293";

  useEffect(() => {
    if (button !== titleButtonType.WinMax) {
      return;
    }

    let unlisten: (() => void) | undefined; // should return nothing, undefined just shuts the type up for when we initialise

    const setup = async () => {
      setIsMaximised(await appWindow.isMaximized());

      unlisten = await appWindow.onResized(async () => {
        setIsMaximised(await appWindow.isMaximized());
      });
    };

    setup(); // we need this in a separate function as appwindow is a promise, which only runs in async. we can make setup async so everything else is fine

    return () => {
      unlisten?.(); // return the unlistener (cleanup function) for react
    };
  });

  if (button === titleButtonType.Close) {
    // are we making a close button?
    text = "\uE8BB"; // unicode for windows close icon
  }

  if (button === titleButtonType.Minimise) {
    // are we making a minimise button?
    text = "\uE921"; // unicode for windows minimise icon
  }

  if (button === titleButtonType.WinMax) {
    // are we making that middle button on a topbar that has two states
    text = isMaximised ? "\uE923" : "\uE922";
  }

  return (
    <button
      className={`titlebutton text-ctp-overlay2 h-full w-12 bg-ctp-surface0 transition-colors ${button !== titleButtonType.Close ? "hover:bg-ctp-surface1 hover:text-ctp-text" : "hover:bg-ctp-red-500 hover:text-white"}`}
      onClick={() => clickButton(button)} // we do this so we dont immediately call it, but we can still pass a parameter in
    >
      {text}
    </button>
  );
}
