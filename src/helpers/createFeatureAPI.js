import core from 'core';
import hotkeys from 'src/apis/hotkeys';
import localStorageManager from 'helpers/localStorageManager';
import TouchEventManager from 'helpers/TouchEventManager';
import Feature from 'constants/feature';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';
import enableTools from 'src/apis/enableTools';
import disableTools from 'src/apis/disableTools';

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
        'annotationCommentButton',
        'toolsButton',
      ],
      fn: () => {
        if (enable) {
          core.showAnnotations(core.getAnnotationsList());
          enableTools(store)();
        } else {
          core.hideAnnotations(core.getAnnotationsList());
          disableTools(store)();
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
          hotkeys.on('ctrl+o, command+o');
        } else {
          hotkeys.off('ctrl+o, command+o');
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
      dataElements: ['printButton', 'printModal'],
      fn: () => {
        if (enable) {
          hotkeys.on('ctrl+p, command+p');
        } else {
          hotkeys.off('ctrl+p, command+p');
        }
      },
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
    [Feature.Copy]: {
      dataElements: ['copyTextButton'],
      fn: () => {
        if (enable) {
          hotkeys.on('ctrl+c, command+c');
        } else {
          hotkeys.off('ctrl+c, command+c');
        }
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
