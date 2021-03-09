import { hot } from 'react-hot-loader/root';
import React, { useEffect } from 'react';
import { useStore, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import Accessibility from 'components/Accessibility';
import Header from 'components/Header';
import ToolsHeader from 'components/Header/ToolsHeader';
import ViewControlsOverlay from 'components/ViewControlsOverlay';
import MenuOverlay from 'components/MenuOverlay';
import AnnotationContentOverlay from 'components/AnnotationContentOverlay';
import DocumentContainer from 'components/DocumentContainer';
import LeftPanel from 'components/LeftPanel';
import NotesPanel from 'components/NotesPanel';
import SearchPanel from 'components/SearchPanel';
import RightPanel from 'components/RightPanel';
import AnnotationPopup from 'components/AnnotationPopup';
import TextPopup from 'components/TextPopup';
import ContextMenuPopup from 'components/ContextMenuPopup';
import RichTextPopup from 'components/RichTextPopup';
import SignatureModal from 'components/SignatureModal';
import PrintModal from 'components/PrintModal';
import LoadingModal from 'components/LoadingModal';
import ErrorModal from 'components/ErrorModal';
import WarningModal from 'components/WarningModal';
import SignatureValidationModal from 'components/SignatureValidationModal';
import PasswordModal from 'components/PasswordModal';
import ProgressModal from 'components/ProgressModal';
import CalibrationModal from 'components/CalibrationModal';
import LinkModal from 'components/LinkModal';
import EditTextModal from 'components/EditTextModal';
import FilterAnnotModal from '../FilterAnnotModal';
import FilePickerHandler from 'components/FilePickerHandler';
import CopyTextHandler from 'components/CopyTextHandler';
import PrintHandler from 'components/PrintHandler';
import FontHandler from 'components/FontHandler';
import ZoomOverlay from 'components/ZoomOverlay';
import CreateStampModal from 'components/CreateStampModal';
import CustomModal from 'components/CustomModal';
import ColorPickerModal from 'components/ColorPickerModal';

import core from 'core';
import defineReaderControlAPIs from 'src/apis';
import loadDocument from 'helpers/loadDocument';
import getHashParams from 'helpers/getHashParams';
import fireEvent from 'helpers/fireEvent';

import actions from 'actions';

import './App.scss';


// TODO: Use constants
const tabletBreakpoint = window.matchMedia('(min-width: 641px) and (max-width: 900px)');

const propTypes = {
  removeEventHandlers: PropTypes.func.isRequired,
};

const App = ({ removeEventHandlers }) => {
  const store = useStore();
  const dispatch = useDispatch();
  let timeoutReturn;

  useEffect(() => {
    defineReaderControlAPIs(store);
    fireEvent('viewerLoaded');

    function loadInitialDocument() {
      const doesAutoLoad = getHashParams('auto_load', true);
      const initialDoc = getHashParams('d', '');
      const startOffline = getHashParams('startOffline', false);

      if ((initialDoc && doesAutoLoad) || startOffline) {
        const options = {
          extension: getHashParams('extension', null),
          filename: getHashParams('filename', null),
          externalPath: getHashParams('p', ''),
          documentId: getHashParams('did', null),
        };

        loadDocument(dispatch, initialDoc, options);
      }
    }

    function loadDocumentAndCleanup() {
      loadInitialDocument();
      window.removeEventListener('message', messageHandler);
      clearTimeout(timeoutReturn)
    }

    function messageHandler(event) {
      if (event.isTrusted &&
        typeof event.data === 'object' &&
        event.data.type === 'viewerLoaded') {
          loadDocumentAndCleanup();
      }
    }

    window.addEventListener('message', messageHandler, false);

    // In case WV is used outside of iframe, postMessage will not
    // receive the message, and this timeout will trigger loadInitialDocument
    timeoutReturn = setTimeout(loadDocumentAndCleanup, 100);

    return removeEventHandlers;
    // eslint-disable-next-line
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

  return (
    <React.Fragment>
      <div className="App">
        <Accessibility />

        <Header />
        <ToolsHeader />
        <div className="content">
          <LeftPanel />
          <DocumentContainer />
          <RightPanel
            dataElement="searchPanel"
            onResize={width => dispatch(actions.setSearchPanelWidth(width))}
          >
            <SearchPanel />
          </RightPanel>
          <RightPanel
            dataElement="notesPanel"
            onResize={width => dispatch(actions.setNotesPanelWidth(width))}
          >
            <NotesPanel />
          </RightPanel>
        </div>
        <ViewControlsOverlay />
        <MenuOverlay />
        <ZoomOverlay />
        <AnnotationContentOverlay />

        <AnnotationPopup />
        <TextPopup />
        <ContextMenuPopup />
        <RichTextPopup />
        <SignatureModal />
        <PrintModal />
        <LoadingModal />
        <ErrorModal />
        <WarningModal />
        <PasswordModal />
        <ProgressModal />
        <CalibrationModal />
        <CreateStampModal />
        <LinkModal />
        <EditTextModal />
        <FilterAnnotModal />
        <CustomModal />
        <ColorPickerModal />
        {core.isFullPDFEnabled() && <SignatureValidationModal />}
      </div>

      <PrintHandler />
      <FilePickerHandler />
      <CopyTextHandler />
      <FontHandler />
    </React.Fragment>
  );
};

App.propTypes = propTypes;

export default hot(App);
