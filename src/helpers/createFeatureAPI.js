import core from 'core';
import hotkeys from 'src/apis/hotkeys';
import localStorageManager from 'helpers/localStorageManager';
import touchEventManager from 'helpers/TouchEventManager';
import hotkeysManager, { Keys, concatKeys } from 'helpers/hotkeysManager';
import Feature from 'constants/feature';
import { PRIORITY_TWO } from 'constants/actionPriority';
import actions from 'actions';
import enableTools from 'src/apis/enableTools';
import disableTools from 'src/apis/disableTools';

// a higher order function that creates the enableFeatures and disableFeatures APIs
export default (enable, store) => (features, priority = PRIORITY_TWO) => {
  // map a feature to the dataElements that should be enabled/disabled and the function to run
  const map = {
    [Feature.Ribbons]: {
      dataElements: [
        'ribbons',
      ],
    },
    [Feature.Annotating]: {
      dataElements: [
        'toolsHeader',
        'toggleToolsButton',
        'annotationPopup',
        'linkButton',
        'noteState',
      ],
      fn: () => {
        if (enable) {
          store.dispatch(actions.enableRibbons());
        } else {
          store.dispatch(actions.setReadOnlyRibbons());
        }
      },
    },
    [Feature.Measurement]: {
      dataElements: [
        "toolbarGroup-Measure",
        'measurementOverlay',
        'distanceToolGroupButton',
        'perimeterToolGroupButton',
        'areaToolGroupButton',
        'rectangleAreaToolGroupButton',
        'ellipseAreaToolGroupButton',
        'countToolGroupButton',
        'cloudyRectangleAreaToolGroupButton',
      ],
    },
    [Feature.Annotations]: {
      dataElements: [
        'ribbons',
        'notesPanel',
        'toggleNotesButton',
        'toggleToolsButton',
        'toolsButton',
        'linkButton',
        'toolsHeader',
        'toolsOverlay',
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
        const keys = concatKeys(Keys.CTRL_O, Keys.COMMAND_O);
        if (enable) {
          hotkeys.on(keys);
        } else {
          hotkeys.off(keys);
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
        const keys = concatKeys(Keys.CTRL_P, Keys.COMMAND_P);
        if (enable) {
          hotkeys.on(keys);
        } else {
          hotkeys.off(keys);
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
          core.setToolMode('AnnotationEdit');
        }
        window.Core.Tools.Tool.ENABLE_TEXT_SELECTION = enable;
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
        const keys = concatKeys(Keys.CTRL_C, Keys.COMMAND_C);
        if (enable) {
          hotkeys.on(keys);
        } else {
          hotkeys.off(keys);
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
    [Feature.NotesPanelVirtualizedList]: {
      fn: () => {
        store.dispatch(actions.setEnableNotesPanelVirtualizedList(enable));
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
    [Feature.MouseWheelZoom]: {
      fn: () => {
        store.dispatch(actions.setMouseWheelZoom(enable));
      }
    },
    [Feature.Search]: {
      dataElements: ['searchButton'],
      fn: () => {
        const keys = concatKeys(Keys.CTRL_F, Keys.COMMAND_F);
        if (enable) {
          hotkeys.on(keys);
        } else {
          hotkeys.off(keys);
        }
      },
    },
    [Feature.MathSymbols]: {
      dataElements: ['mathSymbolsButton', 'richTextPopup'],
    },
    [Feature.OutlineEditing]: {
      dataElements: [
        'outlineControls',
        'addNewOutlineButtonContainer',
        'addNewOutlineButton',
        'outlineReorderButtonGroup',
        'outlineControls',
        'editOutlineButton',
        'outlineEditPopup',
        'renameOutlineButton',
        'deleteOutlineButton',
      ],
    },
    [Feature.NotesShowLastUpdatedDate]: {
      fn: () => {
        store.dispatch(actions.setNotesShowLastUpdatedDate(enable));
      }
    }
  };

  if (!Array.isArray(features)) {
    features = [features];
  }

  features.forEach(feature => {
    const { dataElements = [], fn = () => { } } = map[feature];

    if (enable) {
      store.dispatch(actions.enableElements(dataElements, priority));
    } else {
      store.dispatch(actions.disableElements(dataElements, priority));
    }

    fn();
  });
};
