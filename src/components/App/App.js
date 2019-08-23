import React, { useEffect } from 'react';
import { useStore } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { hot } from 'react-hot-loader';

import Accessibility from 'components/Accessibility';
import Header from 'components/Header';
import ViewControlsOverlay from 'components/ViewControlsOverlay';
import SearchOverlay from 'components/SearchOverlay';
import MenuOverlay from 'components/MenuOverlay';
import RedactionOverlay from 'components/RedactionOverlay';
import PageNavOverlay from 'components/PageNavOverlay';
import SignatureOverlay from 'components/SignatureOverlay';
import MeasurementOverlay from 'components/MeasurementOverlay';
import AnnotationContentOverlay from 'components/AnnotationContentOverlay';
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
import fireEvent from 'helpers/fireEvent';

import './App.scss';

const propTypes = {
  removeEventHandlers: PropTypes.func.isRequired,
};

const App = ({ removeEventHandlers }) => {
  const store = useStore();

  useEffect(() => {
    defineReaderControlAPIs(store);
    fireEvent('viewerLoaded');

    return removeEventHandlers;
  // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="App">
        <Accessibility />

        <Header />

        <LeftPanel />
        <SearchPanel />

        <DocumentContainer />

        <SearchOverlay />
        <ViewControlsOverlay />
        <RedactionOverlay />
        <MenuOverlay />
        <SignatureOverlay />
        <PageNavOverlay />
        <ZoomOverlay />
        <MeasurementOverlay />
        <AnnotationContentOverlay />

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
