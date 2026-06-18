export function PlaybackBox(text: string, callback: () => void) {
  // Text is our text inside the button, callback is what it runs when clicked.
  // Export playbackBox as a function, so we can just get playbackBox() and we get a usable box!
  return (
    <button
      className="aspect-square border-ctp-green-600 border-2 text-ctp-text rounded-md items-center justify-center text-[4cqw]" // Aspect-square will auto size
      // our box to be a square.
      onClick={callback}
    >
      {text}
      {/* Wrapping 'text' in curly braces lets us use our parameter instead of just getting '{text}' literally. */}
    </button>
  );
}
