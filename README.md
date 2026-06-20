# ShowDeck

ShowDeck is a show control system, supporting audio, video and the OSC protocol for advanced control over hardware.
Developed for my **OCR COMPUTER SCIENCE A LEVEL NEA**

This repository does **NOT** accept contributions due to the nature of the project.

## Setup Instructions

- Install NPM + Rust Programming language
- Install [GStreamer](https://gstreamer.freedesktop.org/data/pkg/windows/1.28.4/msvc/gstreamer-1.0-msvc-x86_64-1.28.4.exe) (The link takes you to a windows download, google it for your own OS.) 
- Clone the project via git
- CD into directory where you cloned it
- Edit "test.showdeck" and change the filepath to be a file path of an MP3 file on your system.
- Run the following commands:
`npm install`
`npm run tauri dev`

## Usage Instructions

- Press "load" and load a valid showdeck file (see example)
- Press "GO" and see media / OSC cues play
