export const REQUEST_FOLDER = "REQUEST_FOLDER";
export const RECEIVE_FOLDER = "RECEIVE_FOLDER";
export const RECEIVE_ROOT_FOLDER = "RECEIVE_ROOT_FOLDER";
export const GO_TO_PARENT = "GO_TO_PARENT";
export const GO_TO_PARENT_N = "GO_TO_PARENT_N";

export const PLAY_FOLDER = "PLAY_FOLDER";
export const QUEUE_FOLDER = "QUEUE_FOLDER";

function requestFolder(folderId, rootFolder) {
  return { type: REQUEST_FOLDER, folderId, rootFolder };
}

function receiveRootFolder(folders) {
  return { type: RECEIVE_ROOT_FOLDER, folders };
}

function receiveFolder(folder) {
  return { type: RECEIVE_FOLDER, folder };
}

export function fetchFolder(folderId = "", rootFolder = false) {
  return dispatch => {
    dispatch(requestFolder(folderId, rootFolder));

    return fetch(`/api/folders/${folderId}`)
      .then(response => response.json())
      .then(json => {
        dispatch(
          rootFolder
            ? receiveRootFolder(json.data, rootFolder)
            : receiveFolder(json.data)
        );
      });
  };
}

export function goToParent() {
  return { type: GO_TO_PARENT };
}

export function goToParentN(n) {
  return { type: GO_TO_PARENT, n };
}

export function playFolder(folderId) {
  return { type: PLAY_FOLDER, folderId };
}

export function queueFolder(folderId) {
  return { type: QUEUE_FOLDER, folderId };
}
