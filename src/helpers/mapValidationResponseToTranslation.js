export default ({ errorType }) => {
  switch (errorType) {
    case 'empty':
      return 'formField.formFieldPopup.invalidField.empty';
    case 'duplicate':
      return 'formField.formFieldPopup.invalidField.duplicate';
  }
};