import core from 'core';
import hotkeys from 'src/apis/hotkeys';
import localStorageManager from 'helpers/localStorageManager';
import touchEventManager from 'helpers/TouchEventManager';
import hotkeysManager from 'helpers/hotkeysManager';
import Feature from 'constants/feature';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';
import enableTools from 'src/apis/enableTools';
import disableTools from 'src/apis/disableTools';

// a higher older function that creates the enableFeatures and disableFeatures APIs
export default (enable, store) => features => {
  // map a feature to the dataElements that should be enabled/disabled and the function to run
  const map = {
    [Feature.Annotating]: {
      dataElements: [
        'toolsHeader',
        'toggleToolsButton',
        'annotationPopup',
        'linkButton',
      ],
    },
    [Feature.Measurement]: {
      dataElements: [
        'measurementToolGroupButton',
        'measurementOverlay',
        'distanceMeasurementToolButton',
        'perimeterMeasurementToolButton',
        'areaMeasurementToolButton',
        'ellipseMeasurementToolButton',
      ],
    },
    [Feature.Annotations]: {
      dataElements: [
        'notesPanel',
        'toggleNotesButton',
        'toolsButton',
        'linkButton',
        'toolsHeader',
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
        'toggleNotesButton',
      ],
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
        touchEventManager.enableTouchScrollLock = enable;
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
    [Feature.MultipleViewerMerging]: {
      fn: () => {
        store.dispatch(actions.setIsMultipleViewerMerging(enable));
      },
    },
    [Feature.ThumbnailMerging]: {
      fn: () => {
        store.dispatch(actions.setThumbnailMerging(enable));
      },
    },
    [Feature.ThumbnailReordering]: {
      fn: () => {
        store.dispatch(actions.setThumbnailReordering(enable));
      },
    },
    [Feature.ThumbnailMultiselect]: {
      fn: () => {
        store.dispatch(actions.setThumbnailMultiselect(enable));
      },
    },
    [Feature.PageNavigation]: {
      fn: () => {
        const {
          up: arrowUpHandler,
          down: arrowDownHandler,
          pageup,
          pagedown,
        } = hotkeysManager.keyHandlerMap;

        if (enable) {
          hotkeysManager.on('up', arrowUpHandler);
          hotkeysManager.on('down', arrowDownHandler);
          hotkeysManager.on('pageup', pageup);
          hotkeysManager.on('pagedown', pagedown);
        } else {
          // TODO: doing this will also remove handlers that users registered to 'up' and 'down' and we need to address this issue.
          // it doesn't seem like we can fix the issue now by doing hotkeysManager.off('down', arrowDownHandler) because hotkeysManager.on will create a new function reference
          // , register that new function to the hotkey and we don't have a reference to that function.
          // to fix this issue we may need to breaking the instance.hotkeys.on API.
          hotkeysManager.off('up');
          hotkeysManager.off('down');
          hotkeysManager.off('pageup');
          hotkeysManager.off('pagedown');
          core.setDisplayMode('Single');
        }

        touchEventManager.allowSwipe = enable;
        store.dispatch(actions.setAllowPageNavigation(enable));
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
