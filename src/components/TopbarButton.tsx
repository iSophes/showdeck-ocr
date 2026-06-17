export function TopbarButton(buttonName: string, callback: () => void) {
  //  is window
  return (
    <button
      className={`text-ctp-overlay2 h-full w-20 bg-ctp-surface0 text-center pointer-events-auto text-xs transition-colors hover:bg-ctp-surface1 hover:text-ctp-text focus:bg-ctp-surface2`}
      onClick={callback} // we do this so we dont immediately call it, but we can still pass a parameter in
    >
      {buttonName}
    </button>
  );
}
