import core from 'core';
import createDisableFeatures from 'src/apis/disableFeatures';
import getHashParams from 'helpers/getHashParams';
import { isMobileDevice } from 'helpers/device';
import { PRIORITY_THREE, PRIORITY_ONE } from 'constants/actionPriority';
import Feature from 'constants/feature';
import actions from 'actions';

export default store => {
  const { dispatch, getState } = store;
  const state = getState();

  const disableFeatures = createDisableFeatures(store);

  if (state.advanced.defaultDisabledElements) {
    const elements = state.advanced.defaultDisabledElements.split(',');
    dispatch(actions.disableElements(elements, PRIORITY_THREE));
  }

  // disabling/enabling elements will be handled in onUpdateAnnotationPermission.js
  // the reason for doing this is to avoid duplicate code for handling the `enableReadOnly` constructor option
  // and the effect of programmatically calling instance.setReadOnly
  if (state.viewer.isReadOnly) {
    core.setReadOnly(state.viewer.isReadOnly);
  }

  const notesInLeftPanel = getHashParams('notesInLeftPanel', false);
  if (notesInLeftPanel) {
    dispatch(
      actions.disableElements(
        [
          'toggleNotesButton',
        ]
      )
    );
  } else {
    dispatch(
      actions.disableElements(
        [
          'notesPanel',
          'notesPanelButton',
        ]
      )
    );
  }

  const annotationDisabled = !getHashParams('a', false);
  if (annotationDisabled) {
    disableFeatures([Feature.Annotations]);
  }

  const filePickerDisabled = !getHashParams('filepicker', false);
  if (filePickerDisabled) {
    disableFeatures([Feature.FilePicker]);
  }

  const hideAnnotationPanel = getHashParams('hideAnnotationPanel', false);
  if (hideAnnotationPanel) {
    disableFeatures([Feature.NotesPanel]);
  }

  const measurementsDisabled = !getHashParams('enableMeasurement', false);
  if (measurementsDisabled) {
    disableFeatures([Feature.Measurement]);
  }

  const redactionsDisabled = !(
    getHashParams('enableRedaction', false) || core.isCreateRedactionEnabled()
  );
  if (redactionsDisabled) {
    disableFeatures([Feature.Redaction]);
  }

  const toolBarDisabled = !getHashParams('toolbar', true);
  if (toolBarDisabled) {
    dispatch(actions.disableElement('header', PRIORITY_ONE));
  }

  if (isMobileDevice) {
    dispatch(actions.disableElement('marqueeToolButton', PRIORITY_THREE));
  } else {
    // we could have used the 'hidden' property in the initialState.js to hide this button by css,
    // but that actually checks the window.innerWidth to hide the button, not based on the actual device.
    // we could potentially improve the 'hidden' property in the future.
    dispatch(actions.disableElement('textSelectButton', PRIORITY_THREE));
  }

  if (!core.isFullPDFEnabled()) {
    dispatch(actions.disableElements(['measurementSnappingOption'], PRIORITY_THREE));
  }

  dispatch(
    actions.disableElements(
      [
        // disable layersPanel by default, it will be enabled in onDocumentLoaded.js
        'layersPanel',
        'layersPanelButton',
        'bookmarksPanel',
        'bookmarksPanelButton',
        'wildCardSearchOption',
      ],
      PRIORITY_ONE,
    ),
  );
};
