import { Dispatch, SetStateAction, useState } from "react";

let ip = "127.0.0.1:8000";

export function getIP() {
  return ip;
}

export function setIPGlobally(newIP: string) {
  ip = newIP;
}

export type constants = {
  currentFile: string;
  setFile: Dispatch<SetStateAction<string>>;
  cueTotal: number;
  setTotal: Dispatch<SetStateAction<number>>;
};

export function createConstants(): constants {
  const [currentFile, setFile] = useState("No file loaded");
  const [cueTotal, setTotal] = useState(0);

  return {
    currentFile: currentFile,
    setFile: setFile,
    cueTotal: cueTotal,
    setTotal: setTotal,
  };
}
