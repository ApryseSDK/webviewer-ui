let saveAsHandler = null;

export function setSaveAsHandler(handler) {
  saveAsHandler = handler;
}

export function clearSaveAsHandler() {
  saveAsHandler = null;
}

export function getSaveAsHandler() {
  return saveAsHandler;
}