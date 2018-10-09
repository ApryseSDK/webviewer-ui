export default () =>  {
  const filePicker = document.getElementById('file-picker');

  if (filePicker) {
    document.getElementById('file-picker').click();
  } else {
    console.warn('File picker has been disabled.');
  }
};
