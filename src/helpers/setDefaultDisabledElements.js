import core from 'core';
import createDisableFeatures from 'src/apis/disableFeatures';
import getHashParameters from 'helpers/getHashParameters';
import { isIOS, isMobileDevice } from 'helpers/device';
import { PRIORITY_THREE, PRIORITY_TWO, PRIORITY_ONE } from 'constants/actionPriority';
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

  const notesInLeftPanel = getHashParameters('notesInLeftPanel', false);
  if (notesInLeftPanel) {
    dispatch(
      actions.disableElements(
        [
          'toggleNotesButton',
        ]
      )
    );
  }

  const annotationDisabled = !getHashParameters('a', false);
  if (annotationDisabled) {
    disableFeatures([Feature.Annotations]);
  }

  const filePickerDisabled = !getHashParameters('filepicker', false);
  if (filePickerDisabled) {
    disableFeatures([Feature.FilePicker]);
  }

  const hideAnnotationPanel = getHashParameters('hideAnnotationPanel', false);
  if (hideAnnotationPanel) {
    disableFeatures([Feature.NotesPanel]);
  }

  const toolGroupReorderingDisabled = getHashParameters('disableToolGroupReordering', false);
  if (toolGroupReorderingDisabled) {
    dispatch(actions.setEnableToolGroupReordering(false));
  }

  const measurementsDisabled = !getHashParameters('enableMeasurement', false);
  if (measurementsDisabled) {
    disableFeatures([Feature.Measurement]);
  } else {
    dispatch(
      actions.disableElements(
        [
          'cloudyRectangleAreaToolGroupButton',
        ]
      )
    );
  }

  const redactionsDisabled = !(
    getHashParameters('enableRedaction', false) || core.isCreateRedactionEnabled()
  );
  if (redactionsDisabled) {
    disableFeatures([Feature.Redaction]);
  }

  const toolBarDisabled = !getHashParameters('toolbar', true);
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

  // disabling the fullscreen button in iOS because it only has partial support for the fullscreen mode
  // which is also buggy in WebViewer the last time we tested it
  if (isIOS) {
    dispatch(actions.disableElements(['fullscreenButton'], PRIORITY_THREE));
  }

  if (!core.isFullPDFEnabled()) {
    dispatch(
      actions.disableElements(
        [
          'measurementSnappingOption',
          'signaturePanel',
          'signaturePanelButton',
        ],
        PRIORITY_THREE,
      ),
    );
    disableFeatures([Feature.OutlineEditing]);
  }

  dispatch(actions.disableElements(['contentEditButton'], PRIORITY_TWO));

  dispatch(
    actions.disableElements(
      [
        // disable layersPanel by default, it will be enabled in onDocumentLoaded.js
        'layersPanel',
        'layersPanelButton',
        'bookmarksPanel',
        'bookmarksPanelButton',
        'wildCardSearchOption',
        'readerPageTransitionButton',
        'mathSymbolsButton',
        'threeDToolGroupButton',
        'attachmentPanelButton'
      ],
      PRIORITY_ONE,
    ),
  );

  const enableChangeView = getHashParameters('ChangeView', false);
  if (!enableChangeView) {
    disableFeatures([Feature.ChangeView]);
  }
};