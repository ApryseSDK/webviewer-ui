import { hot } from 'react-hot-loader/root';
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import core from 'core';
import actions from 'actions';

import LogoBar from 'components/LogoBar';
import Accessibility from 'components/Accessibility';
import Header from 'components/Header';
import DocumentContainer from 'components/DocumentContainer';
import RightPanel from 'components/RightPanel';
import FilePickerHandler from 'components/FilePickerHandler';
import CopyTextHandler from 'components/CopyTextHandler';
import PrintHandler from 'components/PrintHandler';
import FontHandler from 'components/FontHandler';
import TextEditingPanel from 'components/TextEditingPanel';
import Wv3dPropertiesPanel from 'components/Wv3dPropertiesPanel';
import AudioPlaybackPopup from 'components/AudioPlaybackPopup';
import DocumentCropPopup from 'components/DocumentCropPopup';
import SnippingToolPopup from '../SnippingToolPopup';
import EmbeddedJSPopup from 'components/EmbeddedJSPopup';
import FormFieldIndicatorContainer from 'components/FormFieldIndicator';
import MultiTabEmptyPage from 'components/MultiTabEmptyPage';
import MultiViewer from 'components/MultiViewer';
import ComparePanel from 'components/MultiViewer/ComparePanel';
import WatermarkPanel from 'components/WatermarkPanel';
import CustomElement from 'components/CustomElement';
import Panel from 'components/Panel';
import LeftHeader from 'components/ModularComponents/LeftHeader';
import RightHeader from 'components/ModularComponents/RightHeader';
import BottomHeader from 'components/ModularComponents/BottomHeader';
import TopHeader from 'components/ModularComponents/TopHeader';
import FlyoutContainer from 'components/ModularComponents/FlyoutContainer';
import RibbonOverflowFlyout from 'components/ModularComponents/RibbonOverflowFlyout';
import ViewControlsFlyout from 'components/ModularComponents/ViewControls/ViewControlsFlyout';
import ProgressModal from 'components/ProgressModal';
import LazyLoadWrapper, { LazyLoadComponents } from 'components/LazyLoadWrapper';
import useOnTextSelected from 'hooks/useOnTextSelected';
import useOnContextMenuOpen from 'hooks/useOnContextMenuOpen';
import useOnAnnotationPopupOpen from 'hooks/useOnAnnotationPopupOpen';
import useOnAlignmentPopupOpen from 'hooks/useOnAlignmentPopupOpen';
import useOnFormFieldAnnotationAddedOrSelected from 'hooks/useOnFormFieldAnnotationAddedOrSelected';
import useOnFreeTextEdit from 'hooks/useOnFreeTextEdit';
import useOnMeasurementToolOrAnnotationSelected from 'hooks/useOnMeasurementToolOrAnnotationSelected';
import useOnInlineCommentPopupOpen from 'hooks/useOnInlineCommentPopupOpen';
import useOnRightClickAnnotation from 'hooks/useOnRightClickAnnotation';
import useOnAnnotationContentOverlayOpen from 'hooks/useOnAnnotationContentOverlayOpen';
import useOnLinkAnnotationPopupOpen from 'hooks/useOnLinkAnnotationPopupOpen';
import useOnAnnotationCreateSignatureToolMode from 'hooks/useOnAnnotationCreateSignatureToolMode';
import useOnAnnotationCreateRubberStampToolMode from 'hooks/useOnAnnotationCreateRubberStampToolMode';
import useOnRedactionAnnotationChanged from 'hooks/useOnRedactionAnnotationChanged';
import useOnHeaderFooterUpdate from 'src/hooks/useOnHeaderFooterUpdate';
import loadDocument from 'helpers/loadDocument';
import getHashParameters from 'helpers/getHashParameters';
import fireEvent from 'helpers/fireEvent';
import { prepareMultiTab } from 'helpers/TabManager';
import hotkeysManager from 'helpers/hotkeysManager';
import setDefaultDisabledElements from 'helpers/setDefaultDisabledElements';
import { getInstanceNode } from 'helpers/getRootNode';
import { isMobileDevice } from 'helpers/device';

import Events from 'constants/events';
import overlays from 'constants/overlays';
import { panelNames } from 'constants/panel';
import DataElements from 'constants/dataElement';
import { defaultPanels } from '../../redux/modularComponents';
import {
  defaultOfficeEditorModularComponents,
  defaultOfficeEditorModularHeaders,
  defaultOfficeEditorPanels,
} from '../../redux/officeEditorModularComponents';
import {
  defaultSpreadsheetEditorHeaders,
  defaultSpreadsheetEditorComponents,
  defaultSpreadsheetEditorPanels,
  defaultSpreadsheetFlyoutMap
} from '../../redux/spreadsheetEditorComponents';

import setLanguage from 'src/apis/setLanguage';
import { loadDefaultFonts } from 'src/helpers/loadFont';
import './App.scss';
import LayersPanel from 'components/LayersPanel';
import MultiViewerWrapper from 'components/MultiViewer/MultiViewerWrapper';
import FeatureFlags from 'constants/featureFlags';
import { PRIORITY_ONE } from 'constants/actionPriority';
import TabsHeader from 'components/TabsHeader';
import useTabFocus from 'hooks/useTabFocus';
import useCloseOnWindowResize from 'hooks/useCloseOnWindowResize';
import PageManipulationFlyout from 'components/ModularComponents/PageManipulationFlyout';
import { VIEWER_CONFIGURATIONS } from 'src/constants/customizationVariables';

// TODO: Use constants
const tabletBreakpoint = window.matchMedia('(min-width: 641px) and (max-width: 900px)');

const propTypes = {
  removeEventHandlers: PropTypes.func.isRequired,
};

const App = ({ removeEventHandlers }) => {
  const store = useStore();
  const dispatch = useDispatch();
  let timeoutReturn;

  const isInDesktopOnlyMode = useSelector(selectors.isInDesktopOnlyMode);
  const isMultiViewerMode = useSelector(selectors.isMultiViewerMode);
  const genericPanels = useSelector(selectors.getGenericPanels, shallowEqual);
  const customModals = useSelector(selectors.getCustomModals, shallowEqual);
  const notesInLeftPanel = useSelector(selectors.getNotesInLeftPanel, shallowEqual);
  const isOfficeEditorMode = useSelector(selectors.getIsOfficeEditorMode);
  const isAccessibleMode = useSelector(selectors.isAccessibleMode);
  const activeFlyout = useSelector(selectors.getActiveFlyout);
  const customizableUI = useSelector(selectors.getIsCustomUIEnabled);
  const currentUIConfiguration = useSelector(selectors.getUIConfiguration);
  const isSpreadsheetEditorModeEnabled = currentUIConfiguration === VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR;

  // These hooks control behaviours regarding the opening and closing of panels and in the case
  // of the redaction hook it creates a reference that tracks the redaction annotations
  useOnAnnotationCreateRubberStampToolMode();
  useOnAnnotationCreateSignatureToolMode();
  useCloseOnWindowResize(() => {
    activeFlyout && dispatch(actions.closeElements([activeFlyout]));
  });
  if (isAccessibleMode) {
    useTabFocus();
  }
  const { redactionAnnotationsList } = useOnRedactionAnnotationChanged();
  const { annotation: widgetAnnotationAddedOrSelected } = useOnFormFieldAnnotationAddedOrSelected();

  useEffect(() => {
    const initialMode = getHashParameters('initialMode', null);
    const uiConfigPath = getHashParameters('uiConfig', '');
    const isOfficeEditingEnabled = getHashParameters('enableOfficeEditing', false);

    if (isOfficeEditingEnabled && isMobileDevice) {
      dispatch(actions.showWarningMessage({
        message: 'officeEditor.notSupportedOnMobile',
      }));
    }

    // Determine final mode (Explicit initialMode takes precedence, fallback to DOCX if office editing is enabled)
    let finalMode = initialMode || (isOfficeEditingEnabled ? VIEWER_CONFIGURATIONS.DOCX_EDITOR : null);

    const validModes = new Set([
      VIEWER_CONFIGURATIONS.DOCX_EDITOR,
      VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR,
      VIEWER_CONFIGURATIONS.DEFAULT,
    ]);

    if (!validModes.has(finalMode)) {
      finalMode = VIEWER_CONFIGURATIONS.DEFAULT;
    }

    // If no mode or office editing, exit early, the default UI will be loaded
    if (!finalMode) {
      return;
    }

    // Ensure default UI is loaded only if no custom `uiConfig` is set
    if (!uiConfigPath) {
      if (finalMode === VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR) {
        loadSpreadsheetEditorUI();
      } else if (finalMode === VIEWER_CONFIGURATIONS.DOCX_EDITOR) {
        loadDocxEditorUI();
      }
    }

    dispatch(actions.setUIConfiguration(finalMode));

  }, []);

  const loadSpreadsheetEditorUI = () => {
    dispatch(actions.setModularHeadersAndComponents(defaultSpreadsheetEditorHeaders, defaultSpreadsheetEditorComponents));
    dispatch(actions.setGenericPanels(defaultSpreadsheetEditorPanels));
    Object.values(defaultSpreadsheetFlyoutMap).forEach((flyout) => dispatch(actions.addFlyout(flyout)));
    dispatch(actions.enableSpreadsheetEditorMode());
  };

  const loadDocxEditorUI = () => {
    dispatch(actions.setModularHeadersAndComponents(defaultOfficeEditorModularHeaders, defaultOfficeEditorModularComponents));
    dispatch(actions.setGenericPanels(defaultOfficeEditorPanels));
    dispatch(actions.setIsOfficeEditorHeaderEnabled(true));
  };

  useEffect(() => {
    loadDefaultFonts();
    const isOfficeEditingEnabled = getHashParameters('enableOfficeEditing', false);
    if (customizableUI) {
      // These elements are disabled in the old UI and need to be enabled in the new UI
      dispatch(actions.enableElements([
        'layersPanel',
        'layersPanelButton',
        'bookmarksPanel',
        'bookmarksPanelButton',
      ], PRIORITY_ONE));
      // set panel width for notes panel to 330px for the new UI
      dispatch(actions.setPanelWidth(DataElements.NOTES_PANEL, 330));
      // set panel width for search panel to 330px for the new UI
      // we dont want to change this for the legacy panels at this time.
      dispatch(actions.setPanelWidth(DataElements.SEARCH_PANEL, 330));
      dispatch(actions.enableFeatureFlag(FeatureFlags.CUSTOMIZABLE_UI));
      // If genericPanels were emptied in Legacy UI, we need to set them back to default when Customizable UI becomes enabled
      if (genericPanels.length === 0) {
        if (isOfficeEditingEnabled) {
          dispatch(actions.setGenericPanels(defaultOfficeEditorPanels));
        } else {
          dispatch(actions.setGenericPanels(defaultPanels));
        }
      }
    } else {
      // To be safe we will clear the generic panels so we don't show modular generic panels
      // in the legacy UI
      dispatch(actions.setGenericPanels([]));
    }
  }, [customizableUI]);

  useEffect(() => {
    // To avoid race condition with window.dispatchEvent firing before window.addEventListener
    setTimeout(() => {
      fireEvent(Events.VIEWER_LOADED);
    }, 300);
    window.isApryseWebViewerWebComponent ?
      fireEvent('ready', undefined, getInstanceNode()) :
      window.parent.postMessage(
        {
          type: 'viewerLoaded',
          id: parseInt(getHashParameters('id'), 10),
        },
        '*',
      );

    async function loadInitialDocument() {
      let initialDoc = getHashParameters('d', '');

      let defaultFile = null;
      if (!initialDoc) {
        defaultFile = getDefaultFile();
      }

      if (defaultFile) {
        loadDocument(dispatch, null, {
          filename: defaultFile,
          isOfficeEditingEnabled: true,
        });

        return;
      }

      const state = store.getState();
      const doesAutoLoad = getHashParameters('auto_load', true);
      initialDoc = initialDoc ? JSON.parse(initialDoc) : '';
      initialDoc = Array.isArray(initialDoc) ? initialDoc : [initialDoc];
      const isMultiTabAlreadyEnabled = state.viewer.isMultiTab;
      const isMultiDoc = initialDoc.length > 1;
      const startOffline = getHashParameters('startOffline', false);
      const basePath = getHashParameters('basePath', '');
      window.Core.setBasePath(basePath);

      if (isMultiDoc && !isMultiTabAlreadyEnabled) {
        prepareMultiTab(initialDoc, store);
        initialDoc = initialDoc[0];
        if ((initialDoc && doesAutoLoad) || startOffline) {
          const options = {
            externalPath: getHashParameters('p', ''),
            documentId: getHashParameters('did', null),
          };
          loadDocument(dispatch, initialDoc, options);
        }
      } else {
        const activeTab = state.viewer.activeTab || 0;
        initialDoc = initialDoc[activeTab];
        if ((initialDoc && doesAutoLoad) || startOffline) {
          const options = {
            extension: getHashParameters('extension', null),
            filename: getHashParameters('filename', null),
            externalPath: getHashParameters('p', ''),
            documentId: getHashParameters('did', null),
            showInvalidBookmarks: getHashParameters('showInvalidBookmarks', false),
          };
          loadDocument(dispatch, initialDoc, options);
        }
      }
    }

    function getDefaultFile() {
      const initialMode = getHashParameters('initialMode', null);
      const isOfficeEditingEnabled = getHashParameters('enableOfficeEditing', false);

      if (initialMode === VIEWER_CONFIGURATIONS.DOCX_EDITOR || isOfficeEditingEnabled) {
        return 'Untitled.docx';
      }
      if (initialMode === VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR) {
        return 'Untitled.xlsx';
      }
      return null;
    }

    function loadDocumentAndCleanup() {
      loadInitialDocument();
      window.removeEventListener('message', messageHandler);
      clearTimeout(timeoutReturn);
    }

    function messageHandler(event) {
      if (event.isTrusted && typeof event.data === 'object' && event.data.type === 'viewerLoaded') {
        loadDocumentAndCleanup();
      }
    }

    window.addEventListener('blur', () => {
      dispatch(actions.closeElements(overlays));
    });
    window.addEventListener('message', messageHandler, false);

    // When a user switches tabs, the focused element can cause unexpected behavior,
    // such as triggering keyboard events or displaying tooltips, when they return
    // to the tab. Blurring the focused element before switching tabs helps to
    // prevent these unwanted interactions.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        if (document.activeElement) {
          document.activeElement.blur();
        }
      }
    });

    // In case WV is used outside of iframe, postMessage will not
    // receive the message, and this timeout will trigger loadInitialDocument
    timeoutReturn = setTimeout(loadDocumentAndCleanup, 500);

    return removeEventHandlers;
  }, []);

  useEffect(() => {
    const setTabletState = () => {
      // TODO: Use constants
      dispatch(actions.setLeftPanelWidth(251));
      dispatch(actions.setNotesPanelWidth(293));
      dispatch(actions.setSearchPanelWidth(293));
    };

    const onBreakpoint = () => {
      if (tabletBreakpoint.matches) {
        setTabletState();
      }
    };
    tabletBreakpoint.addListener(onBreakpoint);
  }, []);

  // These need to be done here to wait for the persisted values loaded in redux
  useEffect(() => {
    setLanguage(store)(store.getState().viewer.currentLanguage);
    hotkeysManager.initialize(store);
    setDefaultDisabledElements(store);
  }, []);

  useEffect(() => {
    const onError = (error) => {
      let errorTitle;
      if (error.type && error.type === 'loaderror') {
        errorTitle = 'message.loadError';
      }
      error = error.detail?.message || error.detail || error.message;

      let errorMessage;

      if (typeof error === 'string') {
        errorMessage = error;

        // provide a more specific error message
        if (errorMessage.includes('File does not exist')) {
          errorMessage = 'message.notSupported';
        }
      } else if (error?.type === 'InvalidPDF') {
        errorMessage = 'message.badDocument';
      }

      if (errorMessage) {
        dispatch(actions.showErrorMessage(errorMessage, errorTitle));
      }
    };

    window.addEventListener('loaderror', onError);
    return () => window.removeEventListener('loaderror', onError);
  }, []);

  useEffect(() => {
    // update cursor and selection properties for Office Editor custom UI
    if (isOfficeEditorMode && customizableUI) {
      const onCursorPropertiesUpdated = async (cursorProperties) => {
        dispatch(actions.setOfficeEditorCursorProperties(cursorProperties));
      };
      const onSelectionPropertiesUpdated = (selectionProperties) => {
        dispatch(actions.setOfficeEditorSelectionProperties(selectionProperties));
      };
      const onOfficeEditorUndoRedoStateChanged = (canUndo, canRedo) => {
        dispatch(actions.setOfficeEditorCanUndo(canUndo));
        dispatch(actions.setOfficeEditorCanRedo(canRedo));
      };

      core.getDocument().addEventListener('cursorPropertiesUpdated', onCursorPropertiesUpdated);
      core.getDocument().addEventListener('selectionPropertiesUpdated', onSelectionPropertiesUpdated);
      core.getDocument().addEventListener('officeEditorUndoRedoStateChanged', onOfficeEditorUndoRedoStateChanged);

      return () => {
        core.getDocument().removeEventListener('selectionPropertiesUpdated', onSelectionPropertiesUpdated);
        core.getDocument().removeEventListener('cursorPropertiesUpdated', onCursorPropertiesUpdated);
        core.getDocument().removeEventListener('officeEditorUndoRedoStateChanged', onOfficeEditorUndoRedoStateChanged);
      };
    }
  }, [isOfficeEditorMode, customizableUI]);

  const renderPanel = (panelName, dataElement) => {
    switch (panelName) {
      case panelNames.OUTLINE:
        return <LazyLoadWrapper Component={LazyLoadComponents.OutlinesPanel} dataElement={dataElement} />;
      case panelNames.SIGNATURE:
        return <LazyLoadWrapper Component={LazyLoadComponents.SignaturePanel} dataElement={dataElement} />;
      case panelNames.BOOKMARKS:
        return <LazyLoadWrapper Component={LazyLoadComponents.BookmarksPanel} dataElement={dataElement} />;
      case panelNames.FILE_ATTACHMENT:
        return <LazyLoadWrapper Component={LazyLoadComponents.FileAttachmentPanel} dataElement={dataElement} />;
      case panelNames.THUMBNAIL:
        return <LazyLoadWrapper Component={LazyLoadComponents.ThumbnailsPanel} dataElement={dataElement} />;
      case panelNames.LAYERS:
        return <LayersPanel />;
      case panelNames.TEXT_EDITING:
        return <TextEditingPanel dataElement={dataElement} />;
      case panelNames.CHANGE_LIST:
        return <ComparePanel dataElement={dataElement}/>;
      case panelNames.STYLE:
        return <LazyLoadWrapper Component={LazyLoadComponents.StylePanel} dataElement={dataElement} />;
      case panelNames.REDACTION:
        return <LazyLoadWrapper Component={LazyLoadComponents.RedactionPanel} dataElement={dataElement} redactionAnnotationsList={redactionAnnotationsList} isCustomPanel={true} />;
      case panelNames.SEARCH:
        return <LazyLoadWrapper Component={LazyLoadComponents.SearchPanel} dataElement={dataElement} />;
      case panelNames.NOTES:
        return <LazyLoadWrapper Component={LazyLoadComponents.NotesPanel} dataElement={dataElement} isCustomPanel={true} />;
      case panelNames.INDEX:
        return <LazyLoadWrapper Component={LazyLoadComponents.IndexPanel} dataElement={dataElement} />;
      case panelNames.TABS:
        return <LazyLoadWrapper Component={LazyLoadComponents.TabPanel} dataElement={dataElement} redactionAnnotationsList={redactionAnnotationsList} />;
      case panelNames.SIGNATURE_LIST:
        return <LazyLoadWrapper Component={LazyLoadComponents.SignatureListPanel} dataElement={dataElement} />;
      case panelNames.RUBBER_STAMP:
        return <LazyLoadWrapper Component={LazyLoadComponents.RubberStampPanel} dataElement={dataElement} />;
      case panelNames.PORTFOLIO:
        return <LazyLoadWrapper Component={LazyLoadComponents.PortfolioPanel} dataElement={dataElement} />;
      case panelNames.FORM_FIELD:
        return <LazyLoadWrapper Component={LazyLoadComponents.FormFieldPanel} dataElement={dataElement} annotation={widgetAnnotationAddedOrSelected} />;
    }
  };

  const panels = genericPanels.map((panel, index) => {
    return (
      panel.render && (
        <Panel key={index} dataElement={panel.dataElement} location={panel.location} isCustom={true}>
          {Object.values(panelNames).includes(panel.render) ? renderPanel(panel.render, panel.dataElement) : (
            <CustomElement
              key={panel.dataElement || index}
              className={`Panel ${panel.dataElement}`}
              display={panel.dataElement}
              dataElement={panel.dataElement}
              render={panel.render}
              isCustomPanel={true}
            />
          )}
        </Panel>
      )
    );
  });

  return (
    <>
      <div
        className={classNames({
          'App': true,
          'is-in-desktop-only-mode': isInDesktopOnlyMode,
          'is-web-component': window.isApryseWebViewerWebComponent,
        })}
      >
        <FlyoutContainer />
        <RibbonOverflowFlyout />
        <ViewControlsFlyout />
        <PageManipulationFlyout />
        <Accessibility />
        <Header />
        {isOfficeEditorMode && !customizableUI && (
          <LazyLoadWrapper
            Component={LazyLoadComponents.OfficeEditorToolsHeader}
            dataElement={DataElements.OFFICE_EDITOR_TOOLS_HEADER}
          />
        )}
        {customizableUI && <TabsHeader />}
        <TopHeader />
        {isSpreadsheetEditorModeEnabled &&
          <LazyLoadWrapper Component={LazyLoadComponents.FormulaBar} dataElement={DataElements.FORMULA_BAR}/>}
        <div className="content">
          <LeftHeader/>
          {!customizableUI && <LazyLoadWrapper
            Component={LazyLoadComponents.LeftPanel}
            dataElement={DataElements.LEFT_PANEL}
          />}
          {(customizableUI || !isOfficeEditorMode) && panels}
          {window?.ResizeObserver && <MultiViewer />}
          {!customizableUI && <RightPanel dataElement={DataElements.SEARCH_PANEL} onResize={(width) => dispatch(actions.setSearchPanelWidth(width))}>
            <LazyLoadWrapper
              Component={LazyLoadComponents.SearchPanel}
              dataElement={DataElements.SEARCH_PANEL}
            />
          </RightPanel>}
          {!customizableUI && <RightPanel dataElement={DataElements.NOTES_PANEL} onResize={(width) => dispatch(actions.setNotesPanelWidth(width))}>
            {!notesInLeftPanel && <LazyLoadWrapper
              Component={LazyLoadComponents.NotesPanel}
              dataElement={DataElements.NOTES_PANEL}
            />}
          </RightPanel>}
          {!customizableUI && <RightPanel dataElement="redactionPanel" onResize={(width) => dispatch(actions.setRedactionPanelWidth(width))}>
            <LazyLoadWrapper
              Component={LazyLoadComponents.RedactionPanel}
              dataElement={DataElements.REDACTION_PANEL}
              redactionAnnotationsList={redactionAnnotationsList} />
          </RightPanel>}
          <RightPanel dataElement="watermarkPanel" onResize={(width) => dispatch(actions.setWatermarkPanelWidth(width))}>
            <WatermarkPanel />
          </RightPanel>
          <RightPanel
            dataElement="wv3dPropertiesPanel"
            onResize={(width) => dispatch(actions.setWv3dPropertiesPanelWidth(width))}
          >
            <Wv3dPropertiesPanel />
          </RightPanel>
          <MultiTabEmptyPage />
          {!customizableUI && <RightPanel
            dataElement="textEditingPanel"
            onResize={(width) => dispatch(actions.setTextEditingPanelWidth(width))}
          >
            <TextEditingPanel />
          </RightPanel>}
          {!customizableUI && <MultiViewerWrapper>
            <RightPanel dataElement="comparePanel" onResize={(width) => dispatch(actions.setComparePanelWidth(width))}>
              <ComparePanel />
            </RightPanel>
          </MultiViewerWrapper>}
          <RightHeader/>
          <BottomHeader/>
          {!isMultiViewerMode && <DocumentContainer />}
        </div>
        <LazyLoadWrapper
          Component={LazyLoadComponents.ViewControlsOverlay}
          dataElement={DataElements.VIEW_CONTROLS_OVERLAY}
        />
        <LazyLoadWrapper
          Component={LazyLoadComponents.MenuOverlay}
          dataElement={DataElements.MENU_OVERLAY}
        />
        <LazyLoadWrapper
          Component={LazyLoadComponents.ZoomOverlay}
          dataElement={DataElements.ZOOM_OVERLAY}
        />
        <LazyLoadWrapper
          Component={LazyLoadComponents.AnnotationContentOverlay}
          dataElement={DataElements.ANNOTATION_CONTENT_OVERLAY}
          onOpenHook={useOnAnnotationContentOverlayOpen}
        />
        <LazyLoadWrapper
          Component={LazyLoadComponents.LinkAnnotationPopup}
          dataElement={DataElements.LINK_ANNOTATION_POPUP}
          onOpenHook={useOnLinkAnnotationPopupOpen}
        />
        <LazyLoadWrapper
          Component={LazyLoadComponents.PageManipulationOverlay}
          dataElement={DataElements.PAGE_MANIPULATION_OVERLAY}
        />
        <LazyLoadWrapper
          Component={LazyLoadComponents.ThumbnailMoreOptionsPopup}
          dataElement={DataElements.THUMBNAILS_CONTROL_MANIPULATE_POPUP}
        />
        <LazyLoadWrapper
          Component={LazyLoadComponents.ThumbnailMoreOptionsPopupSmall}
          dataElement={DataElements.THUMBNAILS_CONTROL_MANIPULATE_POPUP_SMALL}
        />
        <FormFieldIndicatorContainer />
        {/* Popups */}
        {/* AnnotationPopup should be the first so that other popups can lay on top of it */}
        <LazyLoadWrapper
          Component={LazyLoadComponents.AnnotationPopup}
          dataElement={DataElements.ANNOTATION_POPUP}
          onOpenHook={useOnAnnotationPopupOpen}
        />
        <LazyLoadWrapper
          Component={LazyLoadComponents.AlignmentPopup}
          dataElement={DataElements.ANNOTATION_ALIGNMENT_POPUP}
          onOpenHook={useOnAlignmentPopupOpen}
        />
        <LazyLoadWrapper
          Component={LazyLoadComponents.TextPopup}
          dataElement={DataElements.TEXT_POPUP}
          onOpenHook={useOnTextSelected}
        />
        <LazyLoadWrapper
          Component={LazyLoadComponents.ContextMenuPopup}
          dataElement={DataElements.CONTEXT_MENU_POPUP}
          onOpenHook={useOnContextMenuOpen}
        />
        {!customizableUI && (
          <LazyLoadWrapper
            Component={LazyLoadComponents.FormFieldEditPopup}
            dataElement={DataElements.FORM_FIELD_EDIT_POPUP}
            onOpenHook={useOnFormFieldAnnotationAddedOrSelected}
          />
        )}
        {!customizableUI && (
          <LazyLoadWrapper
            Component={LazyLoadComponents.RichTextPopup}
            dataElement={DataElements.RICH_TEXT_POPUP}
            onOpenHook={useOnFreeTextEdit}
          />
        )}
        <LazyLoadWrapper
          Component={LazyLoadComponents.InlineCommentingPopup}
          dataElement={DataElements.INLINE_COMMENT_POPUP}
          onOpenHook={useOnInlineCommentPopupOpen}
        />
        <AudioPlaybackPopup />
        <DocumentCropPopup />
        <SnippingToolPopup />
        {/* Modals */}
        <LazyLoadWrapper
          Component={LazyLoadComponents.ScaleModal}
          dataElement={DataElements.SCALE_MODAL}
          onOpenHook={useOnMeasurementToolOrAnnotationSelected}
        />
        <LazyLoadWrapper Component={LazyLoadComponents.ContentEditLinkModal} dataElement={DataElements.CONTENT_EDIT_LINK_MODAL} />
        <LazyLoadWrapper Component={LazyLoadComponents.SignatureModal} dataElement={DataElements.SIGNATURE_MODAL} />
        <LazyLoadWrapper Component={LazyLoadComponents.PrintModal} dataElement={DataElements.PRINT_MODAL} />
        <LazyLoadWrapper Component={LazyLoadComponents.ErrorModal} dataElement={DataElements.ERROR_MODAL} />
        <LazyLoadWrapper Component={LazyLoadComponents.PasswordModal} dataElement={DataElements.PASSWORD_MODAL} />
        <LazyLoadWrapper
          Component={LazyLoadComponents.CreateStampModal}
          dataElement={DataElements.CUSTOM_STAMP_MODAL}
        />
        <LazyLoadWrapper
          Component={LazyLoadComponents.PageReplacementModal}
          dataElement={DataElements.PAGE_REPLACEMENT_MODAL}
        />
        <LazyLoadWrapper
          Component={LazyLoadComponents.LinkModal}
          dataElement={DataElements.LINK_MODAL}
          onOpenHook={useOnRightClickAnnotation}
        />
        <LazyLoadWrapper Component={LazyLoadComponents.FilterAnnotModal} dataElement={DataElements.FILTER_MODAL} />
        <LazyLoadWrapper
          Component={LazyLoadComponents.PageRedactionModal}
          dataElement={DataElements.PAGE_REDACT_MODAL}
        />
        <LazyLoadWrapper Component={LazyLoadComponents.CalibrationModal} dataElement={DataElements.CALIBRATION_MODAL} />
        <LazyLoadWrapper Component={LazyLoadComponents.SettingsModal} dataElement={DataElements.SETTINGS_MODAL} />
        <LazyLoadWrapper Component={LazyLoadComponents.SaveModal} dataElement={DataElements.SAVE_MODAL} />
        <LazyLoadWrapper Component={LazyLoadComponents.InsertPageModal} dataElement={DataElements.INSERT_PAGE_MODAL} />
        <LazyLoadWrapper Component={LazyLoadComponents.LoadingModal} dataElement={DataElements.LOADING_MODAL} />

        {
          /*
            There were issues appearing in WebViewer BIM add-on with lazy loading ProgressModal.
            The BIM add-on relies on ProgressModal styling which wouldn't not get loaded explicitly.
            This caused styling issues when loading a 3D model and would impact the UI of the BIM add-on.

            See https://apryse.atlassian.net/browse/WVR-3094
          */
        }
        <ProgressModal />

        <LazyLoadWrapper Component={LazyLoadComponents.WarningModal} dataElement={DataElements.WARNING_MODAL} />
        <LazyLoadWrapper Component={LazyLoadComponents.Model3DModal} dataElement={DataElements.MODEL3D_MODAL} />
        <LazyLoadWrapper
          Component={LazyLoadComponents.ColorPickerModal}
          dataElement={DataElements.COLOR_PICKER_MODAL}
        />
        <LazyLoadWrapper Component={LazyLoadComponents.OpenFileModal} dataElement={DataElements.OPEN_FILE_MODAL} />
        {customModals.length > 0 && (
          <LazyLoadWrapper Component={LazyLoadComponents.CustomModal} dataElement={DataElements.CUSTOM_MODAL} />
        )}
        {core.isFullPDFEnabled() && (
          <LazyLoadWrapper
            Component={LazyLoadComponents.SignatureValidationModal}
            dataElement={DataElements.SIGNATURE_VALIDATION_MODAL}
          />
        )}
        <LogoBar />
        <LazyLoadWrapper Component={LazyLoadComponents.CreatePortfolioModal} dataElement={DataElements.CREATE_PORTFOLIO_MODAL} />
        <EmbeddedJSPopup />
        {isOfficeEditorMode && (
          <>
            <LazyLoadWrapper
              Component={LazyLoadComponents.HeaderFooterControlsOverlay}
              dataElement={DataElements.HEADER_FOOTER_CONTROLS_OVERLAY}
              onOpenHook={useOnHeaderFooterUpdate}/>
            <LazyLoadWrapper
              Component={LazyLoadComponents.HeaderFooterOptionsModal}
              dataElement={DataElements.HEADER_FOOTER_OPTIONS_MODAL}
            />
          </>
        )}
      </div>

      <PrintHandler />
      <FilePickerHandler />
      <CopyTextHandler />
      <FontHandler />
    </>
  );
};

App.propTypes = propTypes;

export default hot(App);
