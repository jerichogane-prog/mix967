/* ============================================
   Radio player events — lets any component
   (header "Listen Live", sidebar widget) start
   the single global RadioPlayer.
   ============================================ */

export const RADIO_PLAY_EVENT = "mix967:play-radio";

export function requestRadioPlay(): void {
  window.dispatchEvent(new Event(RADIO_PLAY_EVENT));
}
