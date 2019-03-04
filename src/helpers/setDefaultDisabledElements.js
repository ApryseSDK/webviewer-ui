import core from 'core';
import getHashParams from 'helpers/getHashParams';
import getAnnotationRelatedElements from 'helpers/getAnnotationRelatedElements';
import { isMobileDevice } from 'helpers/device';
import { PRIORITY_THREE, PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => {
  const { dispatch, getState } = store;
  const state = getState();

  disableElementsPassedByConstructor(state, dispatch);
  disableElementsIfReadOnly(state, dispatch);
  disableElementsIfAnnotationDisabled(state, dispatch);
  disableElementsIfFilePickerDisabled(dispatch);
  disableElementsIfHideAnnotationPanel(dispatch);
  disableElementsIfToolBarDisabled(dispatch);
  disableElementsIfMeasurementsDisabled(dispatch);
  disableElementsIfRedactionsDisabled(dispatch);
  disableElementsIfDesktop(dispatch);
  disableElementsIfMobile(dispatch);
};

const disableElementsPassedByConstructor = (state, dispatch) => {
  if (state.advanced.defaultDisabledElements) {
    const elements = state.advanced.defaultDisabledElements.split(',');
    dispatch(actions.disableElements(elements, PRIORITY_THREE));
  }
};

const disableElementsIfReadOnly = (state, dispatch) => {
  if (state.viewer.isReadOnly) {
    const elements = [
      'annotationPopup',
      ...getAnnotationRelatedElements(state)
    ];

    dispatch(actions.disableElements(elements, PRIORITY_ONE));
  }
};

const disableElementsIfAnnotationDisabled = (state, dispatch) => {
  const annotationDisabled = !getHashParams('a', false);
  if (annotationDisabled) {
    const elements = [
      'notesPanel',
      'notesPanelButton',
      ...getAnnotationRelatedElements(state),
    ];

    dispatch(actions.disableElements(elements, PRIORITY_ONE));
  }
};

const disableElementsIfFilePickerDisabled = dispatch => {
  const filePickerDisabled = !getHashParams('filepicker', false);

  if (filePickerDisabled) {
    const elements = [
      'filePickerHandler',
      'filePickerButton',
    ];

    dispatch(actions.disableElements(elements, PRIORITY_ONE));
  }
};

const disableElementsIfHideAnnotationPanel = dispatch => {
  const hideAnnotationPanel = getHashParams('hideAnnotationPanel', false);

  if (hideAnnotationPanel) {
    const elements = [
      'notesPanel',
      'notesPanelButton',
      'annotationCommentButton'
    ];

    dispatch(actions.disableElements(elements, PRIORITY_ONE));
  }
};

const disableElementsIfToolBarDisabled = dispatch => {
  const toolBarDisabled = !getHashParams('toolbar', true);

  if (toolBarDisabled) {
    dispatch(actions.disableElement('header', PRIORITY_ONE));
  }
};

const disableElementsIfMeasurementsDisabled = dispatch => {
  const measurementsDisabled = !getHashParams('enableMeasurement', false);
  if (measurementsDisabled) {
    dispatch(actions.disableElement('measurementToolGroupButton', PRIORITY_ONE));
  }
};

const disableElementsIfRedactionsDisabled = dispatch => {
  const redactionsDisabled = !(getHashParams('enableRedaction', false) || core.isCreateRedactionEnabled());
  if (redactionsDisabled) {
    dispatch(actions.disableElement('redactionButton', PRIORITY_ONE));
  }
};

const disableElementsIfDesktop = dispatch => {
  // we could have used the 'hidden' property in the initialState.js to hide this button by css,
  // but that actually checks the window.innerWidth to hide the button, not based on the actual device.
  // we could potentially improve the 'hidden' property in the future.
  if (!isMobileDevice) {
    dispatch(actions.disableElement('textSelectButton', PRIORITY_THREE));
  }
};

const disableElementsIfMobile = dispatch => {
  if (isMobileDevice) {
    dispatch(actions.disableElement('marqueeToolButton', PRIORITY_THREE));
  }
};