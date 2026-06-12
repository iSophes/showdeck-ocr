import "./App.css"; // Import our App.css file for styling, lets us use tailwind.
import { PlaybackBox } from "./components/PlaybackBox";
import { TitleButton, titleButtonType } from "./components/TitleButton";
import { CueManager, cueTypeEnum } from "./cues/cuemanager";
import { endMedia, pauseMedia, unpauseMedia } from "./media/playmedia";

const cueManager = new CueManager();

// Add some cues for testing

cueManager.addCue(cueTypeEnum.Media, "Dishes", {
  filePath: "assets/dishes.mp3",
});

cueManager.addCue(cueTypeEnum.Media, "Abracadabra", {
  filePath: "assets/abracadabra.mp4",
});

let playing = false;

function previousCue() {}

function go() {
  endMedia();
  cueManager.playCue(cueManager.selectedCue);
}

function toggleCuePlayback() {
  playing = !playing;
  if (playing) {
    unpauseMedia();
    return;
  }

  pauseMedia();
}

function panicCue() {
  cueManager.panicCues();
}

function panicNextCue() {
  cueManager.panicNext();
}

function App() {
  return (
    // Create two divs with a grid pattern with catppuccin theme colours.

    <div className="bg-ctp-base text-ctp-text w-full min-h-screen flex gap-3 p-5">
      <div className="titlebar bg-ctp-surface0 h-10 w-full flex">
        <div data-tauri-drag-region></div>
        <div className="bg-transparent inset-0 absolute flex self-center pointer-events-none justify-center align-middle items-center">
          <text className="text-center pointer-events-auto bg-transparent text-sm">
            ShowDeck | testfile.showdeck | 300 Cues{" "}
            {/* this is just filler text for now */}
          </text>
        </div>

        <div className="controls">
          {TitleButton(titleButtonType.Minimise)} {/* use our component here */}
          {TitleButton(titleButtonType.WinMax)}
          {TitleButton(titleButtonType.Close)}
        </div>
      </div>

      {/* Below creates a new column with a width 1/7 of the screen. It's 1/7th of the screen so that we have consistent sizing on different screens */}
      <div className="@container flex flex-col py-11 w-1/5 gap-3">
        <button
          className="flex border-ctp-green-600 border-2 text-ctp-text px-8 py-4 w-full h-1/5 rounded-md items-center justify-center text-[30cqw]"
          onClick={go}
        >
          {/* New button, green border of radius 2, colour text to fit catpuccin theme */}
          {/* Px-8 moves it 8 pixels to the right py-4 moves it 4 pixels down. w-full fills the column's width, make text 4x larger than default. */}
          GO!
        </button>

        <div className="bg-ctp-base text-ctp-text w-full h-1/10 grid grid-cols-4 gap-3">
          {/* Create a 'grid' with 4 columns, putting each element in the grid. gap-3 will automatically position them with a gap of 3px*/}
          {PlaybackBox("PREVIOUS", previousCue)}
          {PlaybackBox("PLAY", toggleCuePlayback)}
          {PlaybackBox("PANIC", panicCue)}
          {PlaybackBox("PANIC NEXT", panicNextCue)}
        </div>
      </div>

      <video id="my-video"></video>
    </div>
  );
}

export default App; // Export our app so that it can get used!
