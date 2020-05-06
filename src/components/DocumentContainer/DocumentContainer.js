import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import core from 'core';
import { isIE } from 'helpers/device';
import { updateContainerWidth, getClassNameInIE, handleWindowResize } from 'helpers/documentContainerHelper';
import loadDocument from 'helpers/loadDocument';
import getNumberOfPagesToNavigate from 'helpers/getNumberOfPagesToNavigate';
import touchEventManager from 'helpers/TouchEventManager';
import getHashParams from 'helpers/getHashParams';
import setCurrentPage from 'helpers/setCurrentPage';
import { getMinZoomLevel, getMaxZoomLevel } from 'constants/zoomFactors';
import actions from 'actions';
import selectors from 'selectors';

import Measure from 'react-measure';

import './DocumentContainer.scss';

class DocumentContainer extends React.PureComponent {
  static propTypes = {
    isLeftPanelOpen: PropTypes.bool,
    isRightPanelOpen: PropTypes.bool,
    isSearchOverlayOpen: PropTypes.bool,
    doesDocumentAutoLoad: PropTypes.bool,
    zoom: PropTypes.number.isRequired,
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    isHeaderOpen: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    openElement: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired,
    displayMode: PropTypes.string.isRequired,
    leftPanelWidth: PropTypes.number,
    allowPageNavigation: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.document = React.createRef();
    this.container = React.createRef();
    this.wheelToNavigatePages = _.throttle(this.wheelToNavigatePages.bind(this), 300, { trailing: false });
    this.wheelToZoom = _.throttle(this.wheelToZoom.bind(this), 30, { trailing: false });
  }

  componentDidUpdate(prevProps) {
    if (isIE) {
      updateContainerWidth(prevProps, this.props, this.container.current);
    }
  }

  componentDidMount() {
    touchEventManager.initialize(this.document.current, this.container.current);
    core.setScrollViewElement(this.container.current);
    core.setViewerElement(this.document.current);

    this.loadInitialDocument();

    if (isIE) {
      window.addEventListener('resize', this.handleWindowResize);
    }

    if (process.env.NODE_ENV === 'development') {
      this.container.current.addEventListener('dragover', this.preventDefault);
      this.container.current.addEventListener('drop', this.onDrop);
    }

    this.container.current.addEventListener('wheel', this.onWheel, { passive: false });
  }

  componentWillUnmount() {
    touchEventManager.terminate();
    if (isIE) {
      window.removeEventListener('resize', this.handleWindowResize);
    }

    if (process.env.NODE_ENV === 'development') {
      this.container.current.addEventListener('dragover', this.preventDefault);
      this.container.current.removeEventListener('drop', this.onDrop);
    }

    this.container.current.removeEventListener('wheel', this.onWheel, { passive: false });
  }

  loadInitialDocument = () => {
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

      loadDocument(this.props.dispatch, initialDoc, options);
    }
  }

  preventDefault = e => e.preventDefault();

  onDrop = e => {
    e.preventDefault();

    const { files } = e.dataTransfer;
    if (files.length) {
      loadDocument(this.props.dispatch, files[0]);
    }
  }

  handleWindowResize = () => {
    handleWindowResize(this.props, this.container.current);
  }

  onWheel = e => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      this.wheelToZoom(e);
    } else if (!core.isContinuousDisplayMode() && this.props.allowPageNavigation) {
      this.wheelToNavigatePages(e);
    }
  }

  wheelToNavigatePages = e => {
    const { currentPage, totalPages } = this.props;
    const { scrollTop, scrollHeight, clientHeight } = this.container.current;
    const reachedTop = scrollTop === 0;
    const reachedBottom = Math.abs(scrollTop + clientHeight - scrollHeight) <= 1;

    // depending on the track pad used (see this on MacBooks), deltaY can be between -1 and 1 when doing horizontal scrolling which cause page to change
    const scrollingUp = e.deltaY < 0 && Math.abs(e.deltaY) > Math.abs(e.deltaX);
    const scrollingDown = e.deltaY > 0 && Math.abs(e.deltaY) > Math.abs(e.deltaX);

    if (scrollingUp && reachedTop && currentPage > 1) {
      this.pageUp();
    } else if (scrollingDown && reachedBottom && currentPage < totalPages) {
      this.pageDown();
    }
  }

  pageUp = () => {
    const { currentPage } = this.props;
    const { scrollHeight, clientHeight } = this.container.current;

    setCurrentPage(currentPage - getNumberOfPagesToNavigate());
    this.container.current.scrollTop = scrollHeight - clientHeight;
  }

  pageDown = () => {
    const { currentPage } = this.props;

    setCurrentPage(currentPage + getNumberOfPagesToNavigate());
  }

  wheelToZoom = e => {
    const currentZoomFactor = this.props.zoom;
    let newZoomFactor = currentZoomFactor;
    let multiple;

    if (e.deltaY < 0) {
      multiple = 1.25;
      newZoomFactor = Math.min(currentZoomFactor * multiple, getMaxZoomLevel());
    } else if (e.deltaY > 0) {
      multiple = 0.8;
      newZoomFactor = Math.max(currentZoomFactor * multiple, getMinZoomLevel());
    }

    core.zoomToMouse(newZoomFactor);
  }

  handleScroll = () => {
    this.props.closeElements([
      'annotationPopup',
      'textPopup',
    ]);
  }

  getClassName = props => {
    const {
      isSearchOverlayOpen,
    } = props;

    return classNames({
      DocumentContainer: true,
      'search-overlay': isSearchOverlayOpen,
    });
  }

  render() {
    let className;

    if (isIE) {
      className = getClassNameInIE(this.props);
    } else {
      className = this.getClassName(this.props);
    }

    return (
      <Measure
        onResize={() => {
          core.setScrollViewElement(this.container.current);
          core.scrollViewUpdated();
        }}
      >
        {({ measureRef }) => (
          <div className="measurement-container" ref={measureRef}>
            <div
              className={className}
              ref={this.container}
              data-element="documentContainer"
              onScroll={this.handleScroll}
            >
              <div className="document" ref={this.document}></div>
            </div>
          </div>
        )}
      </Measure>
    );
  }
}

const mapStateToProps = state => ({
  isLeftPanelOpen: selectors.isElementOpen(state, 'leftPanel'),
  isRightPanelOpen: selectors.isElementOpen(state, 'searchPanel') || selectors.isElementOpen(state, 'notesPanel'),
  isSearchOverlayOpen: selectors.isElementOpen(state, 'searchOverlay'),
  doesDocumentAutoLoad: selectors.doesDocumentAutoLoad(state),
  zoom: selectors.getZoom(state),
  currentPage: selectors.getCurrentPage(state),
  isHeaderOpen: selectors.isElementOpen(state, 'header') && !selectors.isElementDisabled(state, 'header'),
  displayMode: selectors.getDisplayMode(state),
  totalPages: selectors.getTotalPages(state),
  // using leftPanelWidth to trigger render
  // leftPanelWidth: selectors.getLeftPanelWidth(state),
  allowPageNavigation: selectors.getAllowPageNavigation(state),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  openElement: dataElement => dispatch(actions.openElement(dataElement)),
  closeElements: dataElements => dispatch(actions.closeElements(dataElements)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentContainer);
