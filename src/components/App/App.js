import { hot } from 'react-hot-loader/root';
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector, useStore } from 'react-redux';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import core from 'core';
import actions from 'actions';

import LogoBar from 'components/LogoBar';
import Accessibility from 'components/Accessibility';
import Header from 'components/Header';
import DocumentContainer from 'components/DocumentContainer';
import LeftPanel from 'components/LeftPanel';
import RightPanel from 'components/RightPanel';
import FilePickerHandler from 'components/FilePickerHandler';
import CopyTextHandler from 'components/CopyTextHandler';
import PrintHandler from 'components/PrintHandler';
import FontHandler from 'components/FontHandler';
import RedactionPanel from 'components/RedactionPanel';
import TextEditingPanel from 'components/TextEditingPanel';
import Wv3dPropertiesPanel from 'components/Wv3dPropertiesPanel';
import AudioPlaybackPopup from 'components/AudioPlaybackPopup';
import DocumentCropPopup from 'components/DocumentCropPopup';
import SnippingToolPopup from '../SnippingToolPopup';
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
import GenericOutlinesPanel from 'components/ModularComponents/GenericOutlinesPanel';
import FlyoutContainer from 'components/ModularComponents/FlyoutContainer';
import RibbonOverflowFlyout from 'components/ModularComponents/RibbonOverflowFlyout';
import GroupedToolsOverflowFlyout from 'components/ModularComponents/GroupedToolsOverflowFlyout';
import ProgressModal from 'components/ProgressModal';
import LazyLoadWrapper, { LazyLoadComponents } from 'components/LazyLoadWrapper';

import useOnTextSelected from 'hooks/useOnTextSelected';
import useOnContextMenuOpen from 'hooks/useOnContextMenuOpen';
import useOnAnnotationPopupOpen from 'hooks/useOnAnnotationPopupOpen';
import useOnFormFieldAnnotationAddedOrSelected from 'hooks/useOnFormFieldAnnotationAddedOrSelected';
import useOnFreeTextEdit from 'hooks/useOnFreeTextEdit';
import useOnMeasurementToolOrAnnotationSelected from 'hooks/useOnMeasurementToolOrAnnotationSelected';
import useOnInlineCommentPopupOpen from 'hooks/useOnInlineCommentPopupOpen';
import useOnRightClickAnnotation from 'hooks/useOnRightClickAnnotation';
import useOnAnnotationContentOverlayOpen from 'hooks/useOnAnnotationContentOverlayOpen';

import loadDocument from 'helpers/loadDocument';
import getHashParameters from 'helpers/getHashParameters';
import fireEvent from 'helpers/fireEvent';
import { prepareMultiTab } from 'helpers/TabManager';
import hotkeysManager from 'helpers/hotkeysManager';
import setDefaultDisabledElements from 'helpers/setDefaultDisabledElements';
import { getInstanceNode } from 'helpers/getRootNode';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import { isMobileDevice } from 'helpers/device';

import Events from 'constants/events';
import overlays from 'constants/overlays';
import { panelNames } from 'constants/panel';
import DataElements from 'constants/dataElement';

import setLanguage from 'src/apis/setLanguage';

import './App.scss';
import SignaturePanel from 'components/SignaturePanel';
import BookmarksPanel from 'components/BookmarksPanel';
import FileAttachmentPanel from 'components/FileAttachmentPanel';
import ThumbnailsPanel from 'components/ThumbnailsPanel';
import LayersPanel from 'components/LayersPanel';
import MultiViewerWrapper from 'components/MultiViewer/MultiViewerWrapper';
import TextEditingWrapper from 'components/TextEditingPanel/TextEditingWrapper';

// TODO: Use constants
const tabletBreakpoint = window.matchMedia('(min-width: 641px) and (max-width: 900px)');

const propTypes = {
  removeEventHandlers: PropTypes.func.isRequired,
};

const App = ({ removeEventHandlers }) => {
  const store = useStore();
  const dispatch = useDispatch();
  let timeoutReturn;

  const [
    isInDesktopOnlyMode,
    isMultiViewerMode,
    customFlxPanels,
    customModals,
    notesInLeftPanel,
  ] = useSelector((state) => [
    selectors.isInDesktopOnlyMode(state),
    selectors.isMultiViewerMode(state),
    selectors.getCustomFlxPanels(state),
    selectors.getCustomModals(state),
    selectors.getNotesInLeftPanel(state),
  ]);

  useEffect(() => {
    const isOfficeEditingEnabled = getHashParameters('enableOfficeEditing', false);
    if (isOfficeEditingEnabled && isMobileDevice) {
      dispatch(actions.showWarningMessage({
        message: 'officeEditor.notSupportedOnMobile',
      }));
    }
  }, []);

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
      const isOfficeEditingEnabled = getHashParameters('enableOfficeEditing', false);
      if (!initialDoc && isOfficeEditingEnabled) {
        loadDocument(dispatch, null, {
          filename: 'Untitled.docx',
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
        dispatch(actions.showErrorMessage(errorMessage));
      }
    };

    window.addEventListener('loaderror', onError);
    return () => window.removeEventListener('loaderror', onError);
  }, []);

  const renderPanel = (panelName, dataElement) => {
    switch (panelName) {
      case panelNames.OUTLINE:
        return <GenericOutlinesPanel/>;
      case panelNames.SIGNATURE:
        return <SignaturePanel/>;
      case panelNames.BOOKMARKS:
        return <BookmarksPanel panelSelector={dataElement}/>;
      case panelNames.FILE_ATTACHMENT:
        return <FileAttachmentPanel/>;
      case panelNames.THUMBNAIL:
        return <ThumbnailsPanel panelSelector={dataElement} />;
      case panelNames.LAYERS:
        return <LayersPanel/>;
      case panelNames.TEXT_EDITING:
        return <TextEditingWrapper><TextEditingPanel dataElement={dataElement}/></TextEditingWrapper>;
      case panelNames.CHANGE_LIST:
        return <MultiViewerWrapper><ComparePanel dataElement={dataElement}/></MultiViewerWrapper>;
    }
  };

  const panels = customFlxPanels.map((panel, index) => {
    return (
      panel.render && (
        <Panel key={index} dataElement={panel.dataElement} location={panel.location}>
          {Object.values(panelNames).includes(panel.render) ? renderPanel(panel.render, panel.dataElement) : (
            <CustomElement
              key={panel.dataElement || index}
              className={`Panel ${panel.dataElement}`}
              display={panel.dataElement}
              dataElement={panel.dataElement}
              render={panel.render}
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
        <GroupedToolsOverflowFlyout />
        <Accessibility />
        <Header />
        {isOfficeEditorMode() && (
          <LazyLoadWrapper
            Component={LazyLoadComponents.OfficeEditorToolsHeader}
            dataElement={DataElements.OFFICE_EDITOR_TOOLS_HEADER}
          />
        )}
        <TopHeader />
        <div className="content">
          <LeftHeader />
          <LeftPanel />
          {panels}
          {!isMultiViewerMode && <DocumentContainer />}
          {window?.ResizeObserver && <MultiViewer />}
          <RightHeader />
          <RightPanel dataElement={DataElements.SEARCH_PANEL} onResize={(width) => dispatch(actions.setSearchPanelWidth(width))}>
            <LazyLoadWrapper
              Component={LazyLoadComponents.SearchPanel}
              dataElement={DataElements.SEARCH_PANEL}
            />
          </RightPanel>
          <RightPanel dataElement="notesPanel" onResize={(width) => dispatch(actions.setNotesPanelWidth(width))}>
            {!notesInLeftPanel && <LazyLoadWrapper
              Component={LazyLoadComponents.NotesPanel}
              dataElement={DataElements.NOTES_PANEL}
            />}
          </RightPanel>
          <RightPanel dataElement="redactionPanel" onResize={(width) => dispatch(actions.setRedactionPanelWidth(width))}>
            <RedactionPanel />
          </RightPanel>
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
          <RightPanel
            dataElement="textEditingPanel"
            onResize={(width) => dispatch(actions.setTextEditingPanelWidth(width))}
          >
            <TextEditingPanel />
          </RightPanel>
          <MultiViewerWrapper>
            <RightPanel dataElement="comparePanel" onResize={(width) => dispatch(actions.setComparePanelWidth(width))}>
              <ComparePanel />
            </RightPanel>
          </MultiViewerWrapper>
          <BottomHeader />
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
          Component={LazyLoadComponents.PageManipulationOverlay}
          dataElement={DataElements.PAGE_MANIPULATION_OVERLAY}
        />
        <LazyLoadWrapper
          Component={LazyLoadComponents.RotatePopup}
          dataElement={DataElements.THUMBNAILS_CONTROL_ROTATE_POPUP}
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
          Component={LazyLoadComponents.TextPopup}
          dataElement={DataElements.TEXT_POPUP}
          onOpenHook={useOnTextSelected}
        />
        <LazyLoadWrapper
          Component={LazyLoadComponents.ContextMenuPopup}
          dataElement={DataElements.CONTEXT_MENU_POPUP}
          onOpenHook={useOnContextMenuOpen}
        />
        <LazyLoadWrapper
          Component={LazyLoadComponents.FormFieldEditPopup}
          dataElement={DataElements.FORM_FIELD_EDIT_POPUP}
          onOpenHook={useOnFormFieldAnnotationAddedOrSelected}
        />
        <LazyLoadWrapper
          Component={LazyLoadComponents.RichTextPopup}
          dataElement={DataElements.RICH_TEXT_POPUP}
          onOpenHook={useOnFreeTextEdit}
        />
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
