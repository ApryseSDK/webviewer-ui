import actions from 'actions';

export default store => (enable = true) =>  {
  if (enable) {
    store.dispatch(actions.enableElements(['filePickerHandler', 'filePickerButton']));
  } else {
    store.dispatch(actions.disableElements(['filePickerHandler', 'filePickerButton']));
  }
};
