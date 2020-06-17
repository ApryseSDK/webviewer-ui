import { isMac } from '../helpers/device';

export function isKeyboardNav() {
  return document.documentElement.getAttribute('data-tabbing') === 'true';
}

export function findFocusableIndex(elements, toFind) {
  let index = -1;
  if (!toFind) {
    return index;
  }
  elements.forEach((element, i) => {
    if (index !== -1) {
      return;
    }
    if (element === toFind) {
      index = i;
    }
  });
  return index;
}

// prettier-ignore
const keyMap = {
  "arrow":                  "A",
  "callout":                "C",
  "copy":                   "Control+C",
  "delete":                 "Delete",
  "ellipse":                "O",
  "eraser":                 "E",
  "freehand":               "F",
  "freetext":               "T",
  "highlight":              "H",
  "line":                   "L",
  "pan":                    "P",
  "rectangle":              "R",
  "rotateClockwise":        "Control+Shift+=",
  "rotateCounterClockwise": "Control+Shift+-",
  "select":                 "Escape",
  "signature":              "S",
  "squiggly":               "G",
  "stamp":                  "I",
  "redo":                   "Control+Shift+Z",
  "undo":                   "Control+Z",
  "stickyNote":             "N",
  "strikeout":              "K",
  "underline":              "U",
  "zoomIn":                 "Control+=",
  "zoomOut":                "Control+-",
  "richText.bold":          "Control+B",
  "richText.italic":        "Control+I",
  "richText.underline":     "Control+L",
  "richText.strikeout":     "Control+K",
};

export function shortcutAria(shortcut) {
  let aria = keyMap[shortcut];
  if (aria) {
    if (isMac) {
      aria = aria.replace('Control', 'Meta');
    }
    return aria;
  }

  return undefined;
}
