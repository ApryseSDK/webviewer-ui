import actions from 'actions';

export default dispatch => () => {
  dispatch(actions.setCustomElementOverrides('downloadButton', { disabled: false }));
  dispatch(actions.setCustomElementOverrides('printButton', { disabled: false }));
  dispatch(actions.setCustomElementOverrides('filePickerButton', { disabled: false }));
};
