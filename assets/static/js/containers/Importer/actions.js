export const REQUEST_IMPORT = "REQUEST_IMPORT";

export function requestImport(path) {
  return { type: REQUEST_IMPORT, path };
}

// FIXME, rename to better
export const IMPORTER_UPDATE = "IMPORTER_UPDATE";
export function importerUpdate(data) {
  return { type: IMPORTER_UPDATE, data };
}
