import actions from 'actions';

export default (dispatch) => () => {
  dispatch(actions.setCustomElementOverrides('downloadButton', { disabled: true }));
  dispatch(actions.setCustomElementOverrides('saveAsButton', { disabled: true }));
  dispatch(actions.setCustomElementOverrides('printButton', { disabled: true }));
  dispatch(actions.setCustomElementOverrides('filePickerButton', { disabled: true }));
};
