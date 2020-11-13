import core from 'core';

export default () => {
  // The copyText function should works for 2 cases:
  // 1. User copies from the side panel (window.getSelection())
  // 2. User copies text from the document (core.getSelectedText())
  // We manually to clear the value of #copy-textarea, and this will reset window.getSelection().toString() to ""
  document.querySelector('#copy-textarea').value = '';
  if (window.getSelection()?.toString()) {
    // if we are selecting some text in the UI (i.e. text in note panel) just let it do the normal behaviour
    return;
  }

  if (window.clipboardData) {
    // this is for IE
    window.clipboardData.setData('Text', core.getSelectedText());
  } else {
    const textarea = document.getElementById('copy-textarea');
    textarea.value = core.getSelectedText();
    textarea.select();
    textarea.setSelectionRange(0, 99999); // this is necessary for iOS
    try {
      document.execCommand('copy');
      textarea.blur();
    } catch (e) {
      console.error(`Copy is not supported by browser. ${e}`);
    }
  }
};
