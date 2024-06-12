const SELECTION_BACKGROUND = '#50A5F5FE';
let range;
let docViewer;
let inputElement;

/**
 * @ignore
 * Helper function to keep the highlight of the selected text in the text edit box before the elemnt focus is changed.
 */
export function keepTextEditSelectionOnInputFocus(core) {
  inputElement = document.activeElement;
  docViewer = core.getDocumentViewer();
  // When the input is still in focus but we changed page, we need to un-focus the input.
  docViewer.addEventListener('pageNumberUpdated', handlePageChange, { once: true });
  // When we click anywhere other than the input field itself, it should unfocus.
  document.addEventListener('mousedown', handleClick);

  const currentRange = window.getSelection().getRangeAt(0);
  const isFocusOutsideTextBox = currentRange.startContainer.nodeName === 'DIV';
  // Component re-renders when we focus into the input field because it is a dropdown/input combo.
  // In that case the focus is already shifted out from text edit box and this function is executed again
  // due to re-render. The selection will no longer include the text nodes we initially selected
  // in the text edit box.
  if (isFocusOutsideTextBox) {
    return;
  }

  // When we have nothing selected, simply return
  const isEmptySelection = currentRange.startContainer === currentRange.endContainer && currentRange.startOffset === currentRange.endOffset;
  if (isEmptySelection) {
    return;
  }

  // When the color / font style of the selected text was changed at least once before changing
  // the font size with input field, the selection we get from `getSelection` would have been modified
  // by worker API. In this case, we need to reinitialize the range so that the range object returns to its initial state.
  const isRangeModifiedByWorkerAPI = currentRange.startContainer.nodeName === 'SPAN';
  if (isRangeModifiedByWorkerAPI) {
    range = reinitializeRange(currentRange);
  } else {
    range = currentRange;
  }

  toggleSelectionHighlight(range.startContainer, range.endContainer);
}

/**
 * @ignore
 * Helper function to restore the text edit box selection
 */
export function restoreSelection() {
  if (!range) {
    return;
  }
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  range = null;
  docViewer.removeEventListener('pageNumberUpdated', handlePageChange);
  document.removeEventListener('mousedown', handleClick);
}

/**
 * @ignore
 * Toggles the background color of the selected elements recursively.
 * @param {Text} startTextNode
 * @param {Text} endTextNode
 */
function toggleSelectionHighlight(startTextNode, endTextNode) {
  const startElement = startTextNode.parentElement;
  const selectionEnd = !startElement.nextElementSibling && startElement.parentElement.nextElementSibling === endTextNode;
  if (selectionEnd) {
    return;
  }
  startElement.style.background = SELECTION_BACKGROUND;
  const highlighNextCharacterSameLine = startElement.nextElementSibling?.tagName === 'SPAN' && startTextNode !== endTextNode;
  const highlighNextCharacterNextLine = startElement.nextElementSibling === null && startElement.parentElement.nextElementSibling;
  if (highlighNextCharacterSameLine) {
    // When the next character in selection is in the same line of current character, we simply pass that in
    toggleSelectionHighlight(startElement.nextElementSibling.firstChild, endTextNode);
  } else if (highlighNextCharacterNextLine) {
    // when the next character in selection is in the next line, we need to go into the next line and continue our recursion
    toggleSelectionHighlight(startElement.parentElement.nextElementSibling.firstElementChild.firstChild, endTextNode);
  }
}

function reinitializeRange(workerAPIEditedRange) {
  const selection = window.getSelection();
  selection.removeAllRanges();
  const startNode = workerAPIEditedRange.startContainer.firstChild;
  const endNode = workerAPIEditedRange.endContainer.previousSibling.firstChild;
  workerAPIEditedRange.setStart(startNode, 0);
  workerAPIEditedRange.setEnd(endNode, 1);
  return workerAPIEditedRange;
}

function handlePageChange() {
  if (document.activeElement?.tagName === 'INPUT') {
    document.activeElement.blur();
  }
  docViewer.removeEventListener('pageNumberUpdated', handlePageChange);
  document.removeEventListener('mousedown', handleClick);
}

function handleClick(e) {
  const isClickingFontSizeInput = e.target === inputElement;
  if (!isClickingFontSizeInput) {
    document.activeElement.blur();
    document.removeEventListener('mousedown', handleClick);
  }
}