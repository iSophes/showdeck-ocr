# ShowDeck

ShowDeck is a show control system, supporting audio, video and the OSC protocol for advanced control over hardware.
Developed for my **OCR COMPUTER SCIENCE A LEVEL NEA**

This repository does **NOT** accept contributions due to the nature of the project.

## The base user

Coming soon.

## For Developers

### Setup Instructions

- Install NPM + Rust Programming language
- Install [GStreamer](https://gstreamer.freedesktop.org/data/pkg/windows/1.28.4/msvc/gstreamer-1.0-msvc-x86_64-1.28.4.exe) (The link takes you to a windows download, google it for your own OS.) 

Install it for all users
Install all 'Development' and 'Base' files for an easy time.

- Download the following, extract it, put it somewhere rememberable and add the bin folder inside to PATH
https://sourceforge.net/projects/pkgconfiglite/files/latest/download

Edit your path to change PKG_CONFIG_PATH to be":

PKG_CONFIG_PATH=C:\Program Files\gstreamer\1.0\msvc_x86_64\lib\pkgconfig

If it's installed to your local user, use the following link: https://gstreamer.freedesktop.org/download/#windows to see where it might be. (Try searching through %LOCALAPPDATA%\Programs\gstreamer\1.0\)

Add the location of PKGConfigLite to your user path.
Add C:\Program Files\gstreamer\1.0\msvc_x86_64\bin to path too.

- Clone the project via git
- CD into directory where you cloned it
- Edit "test.showdeck" and change the filepath to be a file path of an MP3 file on your system.
  - Run the following commands:
`npm install`
`npm run tauri dev`

## Usage Instructions

- Press "load" and load a valid showdeck file (see example)
- Press "GO" and see media / OSC cues play
