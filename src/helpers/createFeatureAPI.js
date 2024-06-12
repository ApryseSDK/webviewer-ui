import core from 'core';
import localStorageManager from 'helpers/localStorageManager';
import touchEventManager from 'helpers/TouchEventManager';
import hotkeysManager, { Shortcuts } from 'helpers/hotkeysManager';
import { enableMultiTab } from 'helpers/TabManager';
import Feature from 'constants/feature';
import { PRIORITY_TWO } from 'constants/actionPriority';
import actions from 'actions';
import enableTools from 'src/apis/enableTools';
import disableTools from 'src/apis/disableTools';
import setToolMode from 'src/apis/setToolMode';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import { isOfficeEditorMode } from './officeEditor';

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
        'linkButton',
        'noteState',
        DataElements.NOTE_MULTI_SELECT_MODE_BUTTON,
      ],
      fn: () => {
        const state = store.getState();
        const isCustomizableUI = state.featureFlags.customizableUI;
        if (!isCustomizableUI) {
          if (enable) {
            store.dispatch(actions.enableRibbons());
          } else {
            store.dispatch(actions.setReadOnlyRibbons());
          }
        }
      },
    },
    [Feature.Measurement]: {
      dataElements: [
        'toolbarGroup-Measure',
        'measurementOverlay',
        'distanceToolGroupButton',
        'arcMeasurementToolGroupButton',
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
        'default-ribbon-group',
        'tools-header',
        'notesPanelToggle',
        'rubberStampPanel',
        'stylePanel',
        'signatureListPanel',
        'markReplaceTextToolButton',
      ],
      fn: () => {
        if (isOfficeEditorMode()) {
          console.warn('Office Editor doesn\'t support annotations');
          return;
        }
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
      fn: () => {
        if (enable) {
          store.dispatch(actions.enableDeleteTabWarning());
        } else {
          store.dispatch(actions.disableDeleteTabWarning());
        }
      }
    },
    [Feature.FilePicker]: {
      dataElements: ['filePickerHandler', 'filePickerButton'],
      fn: () => {
        if (enable) {
          hotkeysManager.enableShortcut(Shortcuts.OPEN_FILE);
        } else {
          hotkeysManager.disableShortcut(Shortcuts.OPEN_FILE);
        }
      }
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
        'notesPanelButton',
        'notesPanel',
        'toggleNotesButton',
        'notesPanelToggle',
      ],
    },
    [Feature.InlineComment]: {
      dataElements: [
        DataElements.INLINE_COMMENT_POPUP,
        DataElements.INLINE_COMMENT_POPUP_EXPAND_BUTTON,
        DataElements.INLINE_COMMENT_POPUP_CLOSE_BUTTON,
      ],
      fn: () => {
        if (enable) {
          store.dispatch(actions.setEnableRightClickAnnotationPopup(true));
        }
      },
    },
    [Feature.RightClickAnnotationPopup]: {
      dataElements: [
        // no elements: enabling this will open the popup on right click
        // disabling this will open the popup on left click
      ],
      fn: () => {
        if (enable) {
          store.dispatch(actions.setEnableRightClickAnnotationPopup(true));
        } else {
          store.dispatch(actions.disableElements([
            DataElements.INLINE_COMMENT_POPUP,
            DataElements.INLINE_COMMENT_POPUP_EXPAND_BUTTON,
            DataElements.INLINE_COMMENT_POPUP_CLOSE_BUTTON,
          ], PRIORITY_TWO));
          store.dispatch(actions.setEnableRightClickAnnotationPopup(false));
        }
      },
    },
    [Feature.Print]: {
      dataElements: ['printButton', 'printModal'],
      fn: () => {
        if (enable) {
          hotkeysManager.enableShortcut(Shortcuts.PRINT);
        } else {
          hotkeysManager.disableShortcut(Shortcuts.PRINT);
        }
      }
    },
    [Feature.Redaction]: {
      dataElements: [
        'toolbarGroup-Redact',
        'redactionToolGroupButton',
        'redactionPanel',
        'redactionPanelToggle',
        'pageRedactionToolGroupButton',
      ],
      fn: () => {
        if (enable && !core.isFullPDFEnabled()) {
          console.warn('Full api is not enabled, applying redactions is disabled');
        } else {
          core.enableRedaction(enable);
          const currentToolbarGroup = selectors.getCurrentToolbarGroup(store.getState());
          if (!enable && currentToolbarGroup === 'toolbarGroup-Redact') {
            setToolMode('AnnotationEdit');
          }
        }
      }
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
        if (enable) {
          hotkeysManager.enableShortcut(Shortcuts.COPY);
        } else {
          hotkeysManager.disableShortcut(Shortcuts.COPY);
        }
      }
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
        if (enable) {
          hotkeysManager.enableShortcut(Shortcuts.UP);
          hotkeysManager.enableShortcut(Shortcuts.DOWN);
          hotkeysManager.enableShortcut(Shortcuts.PREVIOUS_PAGE);
          hotkeysManager.enableShortcut(Shortcuts.NEXT_PAGE);
        } else {
          // TODO: doing this will also remove handlers that users registered to 'up' and 'down' and we need to address this issue.
          // it doesn't seem like we can fix the issue now by doing hotkeysManager.off('down', arrowDownHandler) because hotkeysManager.on will create a new function reference
          // , register that new function to the hotkey and we don't have a reference to that function.
          // to fix this issue we may need to breaking the instance.hotkeys.on API.
          hotkeysManager.disableShortcut(Shortcuts.UP);
          hotkeysManager.disableShortcut(Shortcuts.DOWN);
          hotkeysManager.disableShortcut(Shortcuts.PREVIOUS_PAGE);
          hotkeysManager.disableShortcut(Shortcuts.NEXT_PAGE);
          core.setDisplayMode('Single');
        }

        touchEventManager.allowSwipe = enable;
        store.dispatch(actions.setAllowPageNavigation(enable));
      }
    },
    [Feature.MouseWheelZoom]: {
      fn: () => {
        store.dispatch(actions.setMouseWheelZoom(enable));
      }
    },
    [Feature.Search]: {
      dataElements: [
        'searchButton',
        'searchPanelToggle',
      ],
      fn: () => {
        if (enable) {
          hotkeysManager.enableShortcut(Shortcuts.SEARCH);
        } else {
          hotkeysManager.disableShortcut(Shortcuts.SEARCH);
        }
      }
    },
    [Feature.MathSymbols]: {
      dataElements: ['mathSymbolsButton', 'richTextPopup'],
    },
    [Feature.OutlineEditing]: {
      dataElements: [
        'outlineControls',
        'addNewOutlineButtonContainer',
        'addNewOutlineButton',
        'outlineEditPopup',
        'outlineRenameButton',
        'outlineSetDestinationButton',
        'outlineDeleteButton',
      ],
      fn: () => {
        store.dispatch(actions.setIsOutlineEditing(enable));
      }
    },
    [Feature.NotesShowLastUpdatedDate]: {
      fn: () => {
        store.dispatch(actions.setNotesShowLastUpdatedDate(enable));
      }
    },
    [Feature.MultiTab]: {
      fn: () => {
        if (isOfficeEditorMode()) {
          console.warn('Multi-tab is not supported in Office Editor mode');
          return;
        }

        if (enable) {
          if (selectors.isMultiViewerMode(store.getState())) {
            console.error('MultiTab and MultiViewerMode cannot be enabled at the same time, disabling MultiViewerMode');
            store.dispatch(actions.setIsMultiViewerMode(false));
          }
          store.dispatch(enableMultiTab());
        } else {
          store.dispatch(actions.setMultiTab(false));
          store.dispatch(actions.setTabManager(null));
          store.dispatch(actions.setTabs([]));
          store.dispatch(actions.setActiveTab(0));
        }
      },
    },
    [Feature.ChangeView]: {
      dataElements: [
        'changeViewToolGroupButton',
      ]
    },
    [Feature.ContentEdit]: {
      dataElements: [
        'toolbarGroup-EditText',
        'addParagraphToolGroupButton',
        'addImageContentToolGroupButton',
        'contentEditButton',
        'searchAndReplace',
      ],
    },
    [Feature.MultiViewerMode]: {
      fn: () => {
        if (enable && selectors.getIsMultiTab(store.getState())) {
          console.error('MultiTab and MultiViewerMode cannot be enabled at the same time, disabling MultiTab');
          store.dispatch(actions.setMultiTab(false));
          store.dispatch(actions.setTabManager(null));
          store.dispatch(actions.setTabs([]));
          store.dispatch(actions.setActiveTab(0));
        }
        console.warn('Feature.MultiViewerMode is deprecated and will be removed in the next major release. Please use UI.enterMultiViewerMode and UI.exitMultiViewerMode instead.');
        store.dispatch(actions.setIsMultiViewerMode(enable));
      }
    },
    [Feature.SideBySideView]: {
      fn: () => {
        store.dispatch(actions.setIsMultiViewerModeAvailable(enable));
      }
    },
    [Feature.ComparePages]: {
      fn: () => {
        store.dispatch(actions.setComparePagesButtonEnabled(enable));
      }
    },
    [Feature.Initials]: {
      dataElements: [
        'signatureOptionsDropdown',
        'savedSignatureAndInitialsTabs',
      ],
      fn: () => {
        const state = store.getState();
        const signatures = selectors.getDisplayedSignatures(state);
        if (signatures?.length > 0) {
          store.dispatch(actions.setInitialsOffset(signatures.length));
        }
        store.dispatch(actions.setInitialsMode(enable));
      }
    },
    [Feature.SavedSignaturesTab]: {
      dataElements: [DataElements.SAVED_SIGNATURES_TAB],
      fn: () => {
        store.dispatch(actions.setSavedSignaturesTabEnabled(enable));
        if (!enable) {
          store.dispatch(actions.setSelectedTab('signatureModal', 'inkSignaturePanelButton'));
        }
      }
    },
    [Feature.Panel]: {
      fn: () => {
        const state = store.getState();
        const keys = state.viewer.genericPanels.map((item) => item.dataElement);
        if (enable) {
          store.dispatch(actions.enableElements(keys, priority));
        } else {
          store.dispatch(actions.disableElements(keys, priority));
        }
      }
    },
    [Feature.WatermarkPanel]: {
      dataElements: [
        DataElements.WATERMARK_PANEL,
        DataElements.WATERMARK_PANEL_TOGGLE,
      ],
    },
    [Feature.WatermarkPanelImageTab]: {
      dataElements: [
        DataElements.WATERMARK_PANEL_IMAGE_TAB,
      ],
    },
    [Feature.LegacyRichTextPopup]: {
      dataElements: [DataElements.LEGACY_RICH_TEXT_POPUP],
    },
    [Feature.Portfolio]: {
      dataElements: [
        DataElements.CREATE_PORTFOLIO_BUTTON,
        DataElements.PORTFOLIO_PANEL_BUTTON,
        DataElements.PORTFOLIO_PANEL,
      ],
    },
  };

  if (!Array.isArray(features)) {
    features = [features];
  }

  features.forEach((feature) => {
    const { dataElements = [], fn = () => { } } = map[feature];

    if (enable) {
      store.dispatch(actions.enableElements(dataElements, priority));
    } else {
      store.dispatch(actions.disableElements(dataElements, priority));
    }

    fn();
  });
};
