import "./App.css"; // Import our App.css file for styling, lets us use tailwind.
import { PlayMedia } from "./media/playmedia";

function App() {
  return (
    // Create two divs with a grid pattern with catppuccin theme colours.
    <div className="bg-ctp-base text-ctp-text w-full min-h-screen flex gap-3 p-5">
      {/* Below creates a new column with a width 1/7 of the screen. It's 1/7th of the screen so that we have consistent sizing on different screens */}
      <div className="@container flex flex-col w-1/7 gap-3">
        <button
          className="flex border-ctp-green-600 border-2 text-ctp-text px-8 py-4 w-full h-1/7 rounded-md items-center justify-center text-[30cqw]"
          onClick={PlayMedia}
        >
          {/* New button, green border of radius 2, colour text to fit catpuccin theme */}
          {/* Px-8 moves it 8 pixels to the right py-4 moves it 4 pixels down. w-full fills the column's width, make text 4x larger than default. */}
          GO!
        </button>
      </div>

      <video id="my-video"></video>
    </div>
  );
}

export default App; // Export our app so that it can get used!
