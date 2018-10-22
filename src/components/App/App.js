import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { hot } from 'react-hot-loader';
import ReactTooltip from 'react-tooltip';

import Header from 'components/Header';
import ViewControlsOverlay from 'components/ViewControlsOverlay';
import SearchOverlay from 'components/SearchOverlay';
import MenuOverlay from 'components/MenuOverlay';
import PageNavOverlay from 'components/PageNavOverlay';
import ToolsOverlay from 'components/ToolsOverlay';
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
import PasswordModal from 'components/PasswordModal';
import ToolTip from 'components/ToolTip';
import FilePickerHandler from 'components/FilePickerHandler';
import CopyTextHandler from 'components/CopyTextHandler';
import PrintHandler from 'components/PrintHandler';

import { isDesktop } from 'helpers/device';
import actions from 'actions';
import selectors from 'selectors';

import './App.scss';

class App extends React.PureComponent {
  static propTypes = {
    isSearchPanelOpen: PropTypes.bool,
    removeEventHandlers: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // https://github.com/wwayne/react-tooltip/issues/40
    setTimeout(()=> {
      ReactTooltip.rebuild();
    }, 100);
  }

  componentWillUnmount() {
    this.props.removeEventHandlers();
  }

  onClick = () => {
    const elements = [
      'viewControlsOverlay',
      'menuOverlay',
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
          <Header />
          
          <LeftPanel />
          <SearchPanel />

          <DocumentContainer />

          <SearchOverlay />
          <ViewControlsOverlay />
          <MenuOverlay />
          <PageNavOverlay />
          <ToolsOverlay />

          <AnnotationPopup />
          <TextPopup />
          <ContextMenuPopup />
          <ToolStylePopup />

          <SignatureModal />
          <PrintModal />
          <LoadingModal />
          <ErrorModal />
          <PasswordModal />

          <ToolTip />
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
  closeElements: actions.closeElements
};

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(translate()(App)));