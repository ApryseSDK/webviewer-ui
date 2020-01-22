import { hot } from 'react-hot-loader/root';
import React, { useEffect } from 'react';
import { useStore, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import selectors from 'selectors';

import Accessibility from 'components/Accessibility';
import Header from 'components/Header';
import ToolsHeader from 'components/Header/ToolsHeader';
import ViewControlsOverlay from 'components/ViewControlsOverlay';
import SearchOverlay from 'components/SearchOverlay';
import MenuOverlay from 'components/MenuOverlay';
import RedactionOverlay from 'components/RedactionOverlay';
import SignatureOverlay from 'components/SignatureOverlay';
import MeasurementOverlay from 'components/MeasurementOverlay';
import AnnotationContentOverlay from 'components/AnnotationContentOverlay';
import ToolsOverlay from 'components/ToolsOverlay';
import DocumentContainer from 'components/DocumentContainer';
import LeftPanel from 'components/LeftPanel';
import NotesPanel from 'components/NotesPanel';
import SearchPanel from 'components/SearchPanel';
import AnnotationPopup from 'components/AnnotationPopup';
import TextPopup from 'components/TextPopup';
import ContextMenuPopup from 'components/ContextMenuPopup';
import ToolStylePopup from 'components/ToolStylePopup';
import SignatureModal from 'components/SignatureModal';
import PrintModal from 'components/PrintModal';
import LoadingModal from 'components/LoadingModal';
import ErrorModal from 'components/ErrorModal';
import WarningModal from 'components/WarningModal';
import PasswordModal from 'components/PasswordModal';
import ProgressModal from 'components/ProgressModal';
import CalibrationModal from 'components/CalibrationModal';
import FilePickerHandler from 'components/FilePickerHandler';
import CopyTextHandler from 'components/CopyTextHandler';
import PrintHandler from 'components/PrintHandler';
import FontHandler from 'components/FontHandler';
import ZoomOverlay from 'components/ZoomOverlay';

import defineReaderControlAPIs from 'src/apis';
import fireEvent from 'helpers/fireEvent';

import './App.scss';

const propTypes = {
  removeEventHandlers: PropTypes.func.isRequired,
};

const App = ({ removeEventHandlers }) => {
  const [isToolsOverlayOpen, isToolsOverlayDisabled, isNotesOpen, isNotesDisabled, isLeftPanelOpen, isLeftPanelDisabled, isSearchPanelOpen, isSearchPanelDisabled] = useSelector(
    state => [
      selectors.isElementOpen(state, 'toolsOverlay'),
      selectors.isElementDisabled(state, 'toolsOverlay'),
      selectors.isElementOpen(state, 'notesPanel'),
      selectors.isElementDisabled(state, 'notesPanel'),
      selectors.isElementOpen(state, 'leftPanel'),
      selectors.isElementDisabled(state, 'leftPanel'),
      selectors.isElementOpen(state, 'searchPanel'),
      selectors.isElementDisabled(state, 'searchPanel'),
    ],
  );

  const store = useStore();

  useEffect(() => {
    defineReaderControlAPIs(store);
    fireEvent('viewerLoaded');

    return removeEventHandlers;
    // eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <div className="App">
        <Accessibility />

        <Header />
        <ToolsHeader />
        <div className="content">
          {isLeftPanelOpen && !isLeftPanelDisabled && <LeftPanel />}
          <DocumentContainer />
          {isSearchPanelOpen && !isSearchPanelDisabled && <SearchPanel />}
          {isNotesOpen && !isNotesDisabled && <NotesPanel />}
        </div>
        <ViewControlsOverlay />
        <RedactionOverlay />
        <MenuOverlay />
        <SignatureOverlay />
        <ZoomOverlay />
        <MeasurementOverlay />
        <AnnotationContentOverlay />
        {isToolsOverlayOpen && !isToolsOverlayDisabled && <ToolsOverlay />}

        <AnnotationPopup />
        <TextPopup />
        <ContextMenuPopup />

        <SignatureModal />
        <PrintModal />
        <LoadingModal />
        <ErrorModal />
        <WarningModal />
        <PasswordModal />
        <ProgressModal />
        <CalibrationModal />
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
