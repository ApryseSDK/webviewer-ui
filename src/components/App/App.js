import { hot } from 'react-hot-loader/root';
import React, { useEffect } from 'react';
import { useStore, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import Accessibility from 'components/Accessibility';
import Header from 'components/Header';
import ToolsHeader from 'components/Header/ToolsHeader';
import ViewControlsOverlay from 'components/ViewControlsOverlay';
import MenuOverlay from 'components/MenuOverlay';
import MeasurementOverlay from 'components/MeasurementOverlay';
import AnnotationContentOverlay from 'components/AnnotationContentOverlay';
import DocumentContainer from 'components/DocumentContainer';
import LeftPanel from 'components/LeftPanel';
import NotesPanel from 'components/NotesPanel';
import SearchPanel from 'components/SearchPanel';
import AnnotationPopup from 'components/AnnotationPopup';
import TextPopup from 'components/TextPopup';
import ContextMenuPopup from 'components/ContextMenuPopup';
import RichTextPopup from 'components/RichTextPopup';
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

import core from 'core';
import defaultTool from 'constants/defaultTool';

import './App.scss';
import 'constants/pikaday.scss';
import 'constants/quill.scss';

const propTypes = {
  removeEventHandlers: PropTypes.func.isRequired,
};

const mobileListener = window.matchMedia('(max-width: 640px)');
const tabletListener = window.matchMedia('(min-width: 641px) and (max-width: 900px)');
const desktopListener = window.matchMedia('(min-width: 901px)');

const App = ({ removeEventHandlers }) => {
  const store = useStore();
  const dispatch = useDispatch();

  useEffect(() => {
    defineReaderControlAPIs(store);
    fireEvent('viewerLoaded');

    mobileListener.addListener(() => {
      dispatch(actions.setMobileToolsHeader());
      dispatch(actions.closeElements(['toolsOverlay', 'signatureOverlay']));
      core.setToolMode(defaultTool);
      dispatch(actions.setActiveToolGroup(''));
    });

    tabletListener.addListener(() => {
      dispatch(actions.setTabletToolsHeader());
      dispatch(actions.closeElements(['toolsOverlay', 'signatureOverlay']));
      core.setToolMode(defaultTool);
      dispatch(actions.setActiveToolGroup(''));
      dispatch(actions.setLeftPanelWidth(251));
      dispatch(actions.setNotesPanelWidth(293));
      dispatch(actions.setSearchPanelWidth(293));
    });

    desktopListener.addListener(() => {
      dispatch(actions.setDesktopToolsHeader());
      dispatch(actions.closeElements(['toolsOverlay', 'signatureOverlay']));
      core.setToolMode(defaultTool);
      dispatch(actions.setActiveToolGroup(''));
    });

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
        <RichTextPopup />
        <SignatureModal />
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
