export const Views = {
  QUEUE: 'QUEUE',
  SETTINGS: 'SETTINGS',
  PLAYLIST: 'PLAYLIST'
};

export const LibraryViews = {
  TRACKS: 'TRACKS',
  ARTISTS: 'ARTISTS',
  ALBUMS: 'ALBUMS'
};

export const SWITCH_VIEW = 'SWITCH_VIEW';
export const SWITCH_PLAYLIST = 'SWITCH_PLAYLIST';
export const SWITCH_LIBRARY_VIEW = 'SWITCH_LIBRARY_VIEW';

export function switchView(view) {
  return { type: SWITCH_VIEW, view };
}

export function switchPlaylist(playlist) {
  return { type: SWITCH_PLAYLIST, playlist };
}

export function switchLibraryView(libraryView) {
  return { type: SWITCH_LIBRARY_VIEW, libraryView };
}
