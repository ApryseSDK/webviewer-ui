import { hot } from 'react-hot-loader/root';
import React, { useEffect } from 'react';
import { useStore, useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import selectors from 'selectors';

import Accessibility from 'components/Accessibility';
import Header from 'components/Header';
import ToolsHeader from 'components/Header/ToolsHeader';
import ViewControlsOverlay from 'components/ViewControlsOverlay';
import SearchOverlay from 'components/SearchOverlay';
import MenuOverlay from 'components/MenuOverlay';
import PageNavOverlay from 'components/PageNavOverlay';
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
import LinkModal from 'components/LinkModal';
import FilePickerHandler from 'components/FilePickerHandler';
import CopyTextHandler from 'components/CopyTextHandler';
import PrintHandler from 'components/PrintHandler';
import FontHandler from 'components/FontHandler';
import ZoomOverlay from 'components/ZoomOverlay';

import defineReaderControlAPIs from 'src/apis';
import fireEvent from 'helpers/fireEvent';

import actions from 'actions';

import './App.scss';

const propTypes = {
  removeEventHandlers: PropTypes.func.isRequired,
};

const mobileListener = window.matchMedia('(max-width: 640px)');
const tabletListener = window.matchMedia('(min-width: 641px) and (max-width: 900px)');
const desktopListener = window.matchMedia('(min-width: 901px)');

const App = ({ removeEventHandlers }) => {
  const [isToolsHeaderOpen, isToolsHeaderDisabled, isToolsOverlayOpen, isToolsOverlayDisabled, isNotesOpen, isNotesDisabled, isLeftPanelOpen, isLeftPanelDisabled, isSearchPanelOpen, isSearchPanelDisabled, isSignatureModalOpen, isSignatureModalDisabled] = useSelector(
    state => [
      selectors.isElementOpen(state, 'toolsHeader'),
      selectors.isElementDisabled(state, 'toolsHeader'),
      selectors.isElementOpen(state, 'toolsOverlay'),
      selectors.isElementDisabled(state, 'toolsOverlay'),
      selectors.isElementOpen(state, 'notesPanel'),
      selectors.isElementDisabled(state, 'notesPanel'),
      selectors.isElementOpen(state, 'leftPanel'),
      selectors.isElementDisabled(state, 'leftPanel'),
      selectors.isElementOpen(state, 'searchPanel'),
      selectors.isElementDisabled(state, 'searchPanel'),
      selectors.isElementOpen(state, 'signatureModal'),
      selectors.isElementDisabled(state, 'signatureModal'),
    ],
  );

  const store = useStore();
  const dispatch = useDispatch();

  useEffect(() => {
    defineReaderControlAPIs(store);
    fireEvent('viewerLoaded');

    mobileListener.addListener(() => {
      dispatch(actions.setMobileToolsHeader());
    });

    tabletListener.addListener(() => {
      dispatch(actions.setTabletToolsHeader());
    });

    desktopListener.addListener(() => {
      dispatch(actions.setDesktopToolsHeader());
    });

    return removeEventHandlers;
    // eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <div className="App">
        <Accessibility />

        <Header />
        {isToolsHeaderOpen && !isToolsHeaderDisabled && <ToolsHeader />}
        <div className="content">
          <LeftPanel />
          <DocumentContainer />
          <SearchPanel />
          <NotesPanel />
        </div>
        <ViewControlsOverlay />
        <MenuOverlay />
        <ZoomOverlay />
        <MeasurementOverlay />
        <AnnotationContentOverlay />

        <AnnotationPopup />
        <TextPopup />
        <ContextMenuPopup />

        {isSignatureModalOpen && !isSignatureModalDisabled && <SignatureModal />}
        <PrintModal />
        <LoadingModal />
        <ErrorModal />
        <WarningModal />
        <PasswordModal />
        <ProgressModal />
        <CalibrationModal />
        <LinkModal />
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
