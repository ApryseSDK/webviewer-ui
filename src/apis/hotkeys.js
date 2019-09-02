import hotkeys from 'hotkeys-js';

// using on and off to make hotkeys have a similar event interface as docViewer and annotManager
export default {
  on: hotkeys,
  off: hotkeys.unbind,
};