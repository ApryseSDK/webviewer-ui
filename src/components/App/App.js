import React, { useEffect } from 'react';
import { useStore } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { hot } from 'react-hot-loader';

import Header from 'components/Header';
import ViewControlsOverlay from 'components/ViewControlsOverlay';
import SearchOverlay from 'components/SearchOverlay';
import MenuOverlay from 'components/MenuOverlay';
import RedactionOverlay from 'components/RedactionOverlay';
import PageNavOverlay from 'components/PageNavOverlay';
import ToolsOverlay from 'components/ToolsOverlay';
import SignatureOverlay from 'components/SignatureOverlay';
import CursorOverlay from 'components/CursorOverlay';
import MeasurementOverlay from 'components/MeasurementOverlay';
import DocumentContainer from 'components/DocumentContainer';
import LeftPanel from 'components/LeftPanel';
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
import FilePickerHandler from 'components/FilePickerHandler';
import CopyTextHandler from 'components/CopyTextHandler';
import PrintHandler from 'components/PrintHandler';
import ZoomOverlay from 'components/ZoomOverlay';

import defineReaderControlAPIs from 'src/apis';

import './App.scss';

const propTypes = {
  removeEventHandlers: PropTypes.func.isRequired,
};

const App = ({ removeEventHandlers }) => {
  const store = useStore();

  useEffect(() => {
    defineReaderControlAPIs(store);
    window.ControlUtils = {
      // discussed with the team internally, this will be removed in the next major release
      getCustomData: () => {
        console.warn('ControlUtils.getCustomData is deprecated, use instance.getCustomData instead');
        return window.readerControl.getCustomData();
      },
    };

    $(document).trigger('viewerLoaded');

    return removeEventHandlers;
  }, []);

  return (
    <>
      <div className="App">
        <Header />

        <LeftPanel />
        <SearchPanel />

        <DocumentContainer />

        <SearchOverlay />
        <ViewControlsOverlay />
        <RedactionOverlay />
        <MenuOverlay />
        <ToolsOverlay />
        <SignatureOverlay />
        <CursorOverlay />
        <PageNavOverlay />
        <ZoomOverlay />
        <MeasurementOverlay />

        <AnnotationPopup />
        <TextPopup />
        <ContextMenuPopup />
        <ToolStylePopup />

        <SignatureModal />
        <PrintModal />
        <LoadingModal />
        <ErrorModal />
        <WarningModal />
        <PasswordModal />
        <ProgressModal />
      </div>

      <PrintHandler />
      <FilePickerHandler />
      <CopyTextHandler />
    </>
  );
};

App.propTypes = propTypes;

export default hot(module)(withTranslation()(App));
