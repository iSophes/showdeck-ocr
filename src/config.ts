let ip = "127.0.0.1:8000";

export function getIP() {
  return ip;
}

export function setIPGlobally(newIP: string) {
  ip = newIP;
}
