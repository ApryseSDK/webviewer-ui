import core from 'core';

export default () => {
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
