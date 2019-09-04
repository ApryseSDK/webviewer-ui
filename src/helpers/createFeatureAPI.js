import core from 'core';
import localStorageManager from 'helpers/localStorageManager';
import TouchEventManager from 'helpers/TouchEventManager';
import getAnnotationRelatedElements from 'helpers/getAnnotationRelatedElements';
import Feature from 'constants/feature';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';


// a higher older function that creates the enableFeatures and disableFeatures APIs
export default (enable, store) => features => {
  // map a feature to the dataElements that should be enabled/disabled and the function to run
  const map = {
    [Feature.Measurement]: {
      dataElements: [
        'measurementToolGroupButton',
        'measurementOverlay',
        'distanceMeasurementToolButton',
        'perimeterMeasurementToolButton',
        'areaMeasurementToolButton',
      ],
    },
    [Feature.Annotations]: {
      dataElements: [
        'notesPanel',
        'notesPanelButton',
        ...getAnnotationRelatedElements(store.getState()),
      ],
      fn: () => {
        if (enable) {
          core.showAnnotations(core.getAnnotationsList());
        } else {
          core.hideAnnotations(core.getAnnotationsList());
        }
      },
    },
    [Feature.Download]: {
      dataElements: ['downloadButton'],
    },
    [Feature.FilePicker]: {
      dataElements: ['filePickerHandler', 'filePickerButton'],
      fn: () => {
        if (enable) {
          hotkeysManager.on('ctrl+o, command+o');
        } else {
          hotkeysManager.off('ctrl+o, command+o');
        }
      },
    },
    [Feature.LocalStorage]: {
      fn: () => {
        if (enable) {
          localStorageManager.enableLocalStorage();
        } else {
          localStorageManager.disableLocalStorage();
        }
      },
    },
    [Feature.NotesPanel]: {
      dataElements: [
        'annotationCommentButton',
        'notesPanelButton',
        'notesPanel',
      ],
      fn: () => {
        if (enable) {
          store.dispatch(actions.setActiveLeftPanel('notesPanel'));
        } else {
          store.dispatch(actions.setActiveLeftPanel('thumbnailsPanel'));
        }
      },
    },
    [Feature.Print]: {
      // TODO: disableHotkeys
      dataElements: ['printButton', 'printModal'],
    },
    [Feature.Redaction]: {
      dataElements: ['redactionButton'],
      fn: () => {
        if (enable && !core.isFullPDFEnabled()) {
          console.warn(
            'Full api is not enabled, applying redactions is disabled',
          );
        } else {
          core.setToolMode('AnnotationEdit');
        }

        core.enableRedaction(enable);
      },
    },
    [Feature.TextSelection]: {
      dataElements: ['textPopup', 'textSelectButton'],
      fn: () => {
        if (!enable) {
          core.clearSelection();
        }
        window.Tools.Tool.ENABLE_TEXT_SELECTION = enable;
      },
    },
    [Feature.TouchScrollLock]: {
      fn: () => {
        TouchEventManager.enableTouchScrollLock = enable;
      },
    },
    [Feature.CopyText]: {
      dataElements: ['CopyTextButton'],
      fn: () => {
        // TODO: disable hotkey
      },
    },
  };

  if (!Array.isArray(features)) {
    features = [features];
  }

  features.forEach(feature => {
    const { dataElements = [], fn = () => {} } = map[feature];

    if (enable) {
      store.dispatch(actions.enableElements(dataElements, PRIORITY_ONE));
    } else {
      store.dispatch(actions.disableElements(dataElements, PRIORITY_ONE));
    }

    fn();
  });
};
