export const Views = {
  QUEUE: 'QUEUE',
  SETTINGS: 'SETTINGS',
  PLAYLIST: 'PLAYLIST'
};

export const SWITCH_VIEW = 'SWITCH_VIEW';
export const SWITCH_PLAYLIST = 'SWITCH_PLAYLIST';

export function switchView(view) {
  return { type: SWITCH_VIEW, view };
}

export function switchPlaylist(playlist) {
  return { type: SWITCH_PLAYLIST, playlist };
}
