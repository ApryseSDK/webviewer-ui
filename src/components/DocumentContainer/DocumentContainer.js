import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import core from 'core';
import { isIE } from 'helpers/device';
import { updateContainerWidth, getClassNameInIE, handleWindowResize } from 'helpers/documentContainerHelper';
import loadDocument from 'helpers/loadDocument';
import TouchEventManager from 'helpers/TouchEventManager';
import { ZOOM_MIN, ZOOM_MAX } from 'constants/zoomFactors';
import actions from 'actions';
import selectors from 'selectors';

import './DocumentContainer.scss';

class DocumentContainer extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object.isRequired,
    advanced: PropTypes.object.isRequired,
    isLeftPanelOpen: PropTypes.bool,
    isRightPanelOpen: PropTypes.bool,
    isSearchOverlayOpen: PropTypes.bool,
    hasPath: PropTypes.bool,
    doesDocumentAutoLoad: PropTypes.bool,
    zoom: PropTypes.number.isRequired,
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    isHeaderOpen: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    openElement: PropTypes.func.isRequired,
    displayMode: PropTypes.string.isRequired
  }

  constructor() {
    super();
    this.document = React.createRef();
    this.container = React.createRef();
    this.touchEventManager = Object.create(TouchEventManager);
    this.wheelToNavigatePages = _.throttle(this.wheelToNavigatePages.bind(this), 300, { trailing: false });
    this.wheelToZoom = _.throttle(this.wheelToZoom.bind(this), 30, { trailing: false });
  }

  componentDidUpdate(prevProps) {
    if (isIE) {
      updateContainerWidth(prevProps, this.props, this.container.current);
    }
  }

  componentDidMount() {
    this.touchEventManager.initialize(this.document.current, this.container.current);
    core.setScrollViewElement(this.container.current);
    core.setViewerElement(this.document.current);

    const { hasPath, doesDocumentAutoLoad, openElement, document, advanced, dispatch } = this.props;
    if (hasPath && doesDocumentAutoLoad) {
      openElement('loadingModal');
      loadDocument({ document, advanced }, dispatch);
    }

    if (isIE) {
      window.addEventListener('resize', this.handleWindowResize);
    }
  }

  componentWillUnmount() {
    this.touchEventManager.terminate();
    if (isIE) {
      window.removeEventListener('resize', this.handleWindowResize);
    }
  }

  handleWindowResize = () => {
    handleWindowResize(this.props, this.container.current);
  }

  onWheel = e => {    
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      this.wheelToZoom(e);
    } else if (!core.isContinuousDisplayMode()){
      this.wheelToNavigatePages(e);
    }
  }

  wheelToNavigatePages = e => {
    const { currentPage, totalPages } = this.props;
    const { scrollTop, scrollHeight, clientHeight } = this.container.current;
    const reachedTop = scrollTop === 0;
    // we have 1 instead of just checking scrollTop + clientHeight === scrollHeight is because
    // for some screens it has ~1 pixels off
    const reachedBottom = Math.abs(scrollTop + clientHeight - scrollHeight) <= 1;

    if (e.deltaY < 0 && reachedTop && currentPage > 1) {
      this.navigatePagesUp();
    } else if (e.deltaY > 0 && reachedBottom && currentPage < totalPages) {
      this.navigatePagesDown();
    }
  }

  navigatePagesUp = () => {
    const { scrollHeight, clientHeight } = this.container.current;
    const newPage = this.props.currentPage - this.getNumberOfPagesToNavigate();

    core.setCurrentPage(Math.max(newPage, 1));
    this.container.current.scrollTop = scrollHeight - clientHeight;    
  }

  navigatePagesDown = () => {
    const newPage = this.props.currentPage + this.getNumberOfPagesToNavigate();

    core.setCurrentPage(Math.min(newPage, this.props.totalPages));
  }

  getNumberOfPagesToNavigate = () => {
    const mapDisplayModeToNumberOfPages = {
      Single: 1,
      Facing: 2,
      CoverFacing: 2,
    };

    return mapDisplayModeToNumberOfPages[this.props.displayMode];
  }

  wheelToZoom = e => {
    const currentZoomFactor = this.props.zoom;
    let newZoomFactor = currentZoomFactor;
    let multiple;

    if (e.deltaY < 0) {
      multiple = 1.25;
      newZoomFactor = Math.min(currentZoomFactor * multiple, ZOOM_MAX);
    } else if (e.deltaY > 0) {
      multiple = 0.8;
      newZoomFactor = Math.max(currentZoomFactor * multiple, ZOOM_MIN);
    }

    core.zoomToMouse(newZoomFactor);
  }

  onTransitionEnd = () => {
    core.scrollViewUpdated();
  }

  getClassName = props => {
    const { isLeftPanelOpen, isRightPanelOpen, isHeaderOpen, isSearchOverlayOpen } = props;
    
    return [
      'DocumentContainer',
      isLeftPanelOpen ? 'left-panel' : '',
      isRightPanelOpen ? 'right-panel' : '',
      isHeaderOpen ? '' : 'no-header',
      isSearchOverlayOpen ? 'search-overlay' : ''
    ].join(' ').trim();
  }

  render() {
    let className;

    if (isIE) {
      className = getClassNameInIE(this.props);  
    } else {
      className = this.getClassName(this.props);
    }

    return(
      <div className={className} ref={this.container} data-element="documentContainer" onWheel={this.onWheel} onTransitionEnd={this.onTransitionEnd}>
        <div className="document" ref={this.document}></div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  document: selectors.getDocument(state),
  advanced: selectors.getAdvanced(state),
  isLeftPanelOpen: selectors.isElementOpen(state, 'leftPanel'),
  isRightPanelOpen: selectors.isElementOpen(state, 'searchPanel'),
  isSearchOverlayOpen: selectors.isElementOpen(state, 'searchOverlay'),
  hasPath: selectors.hasPath(state),
  doesDocumentAutoLoad: selectors.doesDocumentAutoLoad(state),
  zoom: selectors.getZoom(state),
  currentPage: selectors.getCurrentPage(state),
  isHeaderOpen: selectors.isElementOpen(state, 'header') && !selectors.isElementDisabled(state, 'header'),
  displayMode: selectors.getDisplayMode(state),
  totalPages: selectors.getTotalPages(state)
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  openElement: (dataElement, loadingMessage) => dispatch(actions.openElement(dataElement, loadingMessage)) 
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentContainer);