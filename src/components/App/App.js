import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
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

import { isDesktop } from 'helpers/device';
import actions from 'actions';
import selectors from 'selectors';

import keyboardJS from 'keyboardjs';

import './App.scss';

class App extends React.PureComponent {
  static propTypes = {
    isSearchPanelOpen: PropTypes.bool,
    removeEventHandlers: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired
  }

  // constructor(props) {
  //   super(props);

  //   $(document).on('documentLoaded', () => {
  //     window.docViewer.on('pageComplete', (e, pageIndex) => {
  //       window.docViewer.getDocument().loadPageText(pageIndex, function(text) {
  //         var textContainer = document.createElement('div');
  //         // textContainer.tabIndex = 0;
  //         textContainer.textContent = text;
  //         textContainer.style = 'height: 100%;';
  //         textContainer.id = 'pageText' + pageIndex;
  //         $('#pageContainer' + pageIndex).append(textContainer);
  //       });
  //     });
  //   });
  // }

  componentDidMount() {
    keyboardJS.bind('alt + m', () => this.props.toggleElement('leftPanel'));
  }

  componentWillUnmount() {
    this.props.removeEventHandlers();
  }

  onClick = () => {
    const elements = [
      'viewControlsOverlay',
      'menuOverlay',
      'zoomOverlay',
      'signatureOverlay',
      this.props.isSearchPanelOpen ? '' : 'searchOverlay'
    ].filter(element => element);

    this.props.closeElements(elements);
  }

  onMouseDown = () => {
    const elements = [
      'annotationPopup',
      'contextMenuPopup',
      'toolStylePopup',
      'textPopup',
      isDesktop() ? 'redactionOverlay' : '',
      isDesktop() ? 'toolsOverlay' : ''
    ].filter(element => element);

    this.props.closeElements(elements);
  }

  onScroll = () => {
    this.onMouseDown();
  }

  render() {
    return (
      <React.Fragment>
        <div className="App" onMouseDown={this.onMouseDown} onClick={this.onClick} onScroll={this.onScroll}>
          <a
            tabIndex={0}
            className="skip-main"
            onClick={() => {
              $('*[data-element=\'documentContainer\']').focus();
            }}
            onKeyPress={e => {
              if (e.nativeEvent.key === 'Enter' || e.nativeEvent.code === 'Space') {
                $('*[data-element=\'documentContainer\']').focus();
              }
            }}
          >
            Skip to main content
          </a>
          <Header />

          <LeftPanel />
          <SearchPanel />

          <DocumentContainer />

          <SearchOverlay />
          <ViewControlsOverlay />
          <RedactionOverlay />
          <MenuOverlay />
          <PageNavOverlay />
          <ToolsOverlay />
          <SignatureOverlay />
          <CursorOverlay />
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isSearchPanelOpen: selectors.isElementOpen(state, 'searchPanel'),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  toggleElement: actions.toggleElement,
};

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(translate()(App)));
