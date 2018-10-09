import core from 'core';

export default () => {
  if (window.clipboardData) {
    window.clipboardData.setData('Text', core.getSelectedText());
  } else {
    const textarea = document.getElementById('copy-textarea');
    textarea.value = core.getSelectedText();
    textarea.select();
    textarea.setSelectionRange(0, 99999); // this is necessary for iOS
    try {
      document.execCommand('copy');
      textarea.blur();
    } catch(e) {
      console.error('Copy is not supported by browser. ' + e);
    }
  }
};
