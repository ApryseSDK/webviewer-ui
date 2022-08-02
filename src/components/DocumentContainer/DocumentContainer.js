import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import core from 'core';
import { isIE, isIE11 } from 'helpers/device';
import { updateContainerWidth, getClassNameInIE, handleWindowResize } from 'helpers/documentContainerHelper';
import loadDocument from 'helpers/loadDocument';
import getNumberOfPagesToNavigate from 'helpers/getNumberOfPagesToNavigate';
import touchEventManager from 'helpers/TouchEventManager';
import setCurrentPage from 'helpers/setCurrentPage';
import { getMinZoomLevel, getMaxZoomLevel } from 'constants/zoomFactors';
import MeasurementOverlay from 'components/MeasurementOverlay';
import PageNavOverlay from 'components/PageNavOverlay';
import ToolsOverlay from 'components/ToolsOverlay';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';
import ReaderModeViewer from 'components/ReaderModeViewer';
import { zoomIn, zoomOut, getStep } from 'helpers/zoom';

import Measure from 'react-measure';

import './DocumentContainer.scss';
import _ from 'lodash';
import TabsHeader from 'components/TabsHeader';

const PAGE_NAVIGATION_OVERLAY_FADEOUT = 4000;

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
    isMouseWheelZoomEnabled: PropTypes.bool.isRequired,
    isReaderMode: PropTypes.bool,
    setDocumentContainerWidth: PropTypes.func.isRequired,
    setDocumentContainerHeight: PropTypes.func.isRequired,
    isInDesktopOnlyMode: PropTypes.bool,
    isRedactionPanelOpen: PropTypes.bool,
    isWv3dPropertiesPanelOpen: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.document = React.createRef();
    this.container = React.createRef();
    this.wheelToNavigatePages = _.throttle(this.wheelToNavigatePages.bind(this), 300, { trailing: false });
    this.wheelToZoom = _.throttle(this.wheelToZoom.bind(this), 30, { trailing: false });
    this.handleResize = _.throttle(this.handleResize.bind(this), 200);
    this.debouncedHidePageNavigationOverlay = _.debounce(
      this.hidePageNavigationOverlay,
      PAGE_NAVIGATION_OVERLAY_FADEOUT,
    );
    this.state = {
      showNavOverlay: true,
    };
  }

  componentDidUpdate(prevProps) {
    if (isIE11) {
      updateContainerWidth(prevProps, this.props, this.container.current);
    }
  }

  componentDidMount() {
    touchEventManager.initialize(this.document.current, this.container.current);
    core.setScrollViewElement(this.container.current);
    core.setViewerElement(this.document.current);

    if (isIE) {
      window.addEventListener('resize', this.handleWindowResize);
    }

    if (process.env.NODE_ENV === 'development') {
      this.container.current.addEventListener('dragover', this.preventDefault);
      this.container.current.addEventListener('drop', this.onDrop);
    }

    this.container.current.addEventListener('wheel', this.onWheel, { passive: false });
    this.updateContainerSize();
    core.addEventListener('documentLoaded', this.showAndFadeNavigationOverlay);
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
    core.removeEventListener('documentLoaded', this.showAndFadeNavigationOverlay);
  }

  preventDefault = e => e.preventDefault();

  onDrop = e => {
    e.preventDefault();

    const { files } = e.dataTransfer;
    if (files.length) {
      loadDocument(this.props.dispatch, files[0]);
    }
  };

  handleWindowResize = () => {
    handleWindowResize(this.props, this.container.current);
  };

  onWheel = e => {
    const { isMouseWheelZoomEnabled } = this.props;
    if (isMouseWheelZoomEnabled && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this.wheelToZoom(e);
    } else if (
      !core.isContinuousDisplayMode() &&
      this.props.allowPageNavigation &&
      !this.props.isReaderMode &&
      core.isScrollableDisplayMode()
    ) {
      const { currentPage, totalPages } = this.props;
      const { scrollTop, scrollHeight, clientHeight } = this.container.current;
      const reachedTop = scrollTop === 0;
      const reachedBottom = Math.abs(scrollTop + clientHeight - scrollHeight) <= 1;

      // depending on the track pad used (see this on MacBooks), deltaY can be between -1 and 1 when doing horizontal scrolling which cause page to change
      const scrollingUp = e.deltaY < 0 && Math.abs(e.deltaY) > Math.abs(e.deltaX);
      const scrollingDown = e.deltaY > 0 && Math.abs(e.deltaY) > Math.abs(e.deltaX);

      const shouldGoUp = scrollingUp && reachedTop && currentPage > 1;
      const shouldGoDown = scrollingDown && reachedBottom && currentPage < totalPages;

      const shouldPreventParentScrolling = (e.deltaY < 0 && currentPage > 1) || (e.deltaY > 0 && currentPage < totalPages);

      if (shouldPreventParentScrolling) {
        e.preventDefault();
        e.stopPropagation();
      }

      this.wheelToNavigatePages(e, shouldGoUp, shouldGoDown);
      this.props.closeElements(['annotationPopup', 'textPopup', 'annotationNoteConnectorLine']);
    }
  };

  wheelToNavigatePages = (e, shouldGoUp, shouldGoDown) => {
    if (shouldGoUp) {
      this.pageUp();
    } else if (shouldGoDown) {
      this.pageDown();
    }

    this.showPageNavigationOverlay();
    this.debouncedHidePageNavigationOverlay();
  };

  pageUp = () => {
    const { currentPage } = this.props;
    const { scrollHeight, clientHeight } = this.container.current;

    setCurrentPage(currentPage - getNumberOfPagesToNavigate());
    this.container.current.scrollTop = scrollHeight - clientHeight;
  };

  pageDown = () => {
    const { currentPage } = this.props;

    setCurrentPage(currentPage + getNumberOfPagesToNavigate());
  };

  wheelToZoom = e => {
    const currentZoomFactor = this.props.zoom;
    let newZoomFactor = currentZoomFactor;
    if (e.deltaY < 0) {
      newZoomFactor = Math.min(
        currentZoomFactor + getStep(currentZoomFactor),
        getMaxZoomLevel()
      );
    } else if (e.deltaY > 0) {
      newZoomFactor = Math.max(
        currentZoomFactor - getStep(currentZoomFactor),
        getMinZoomLevel()
      );
    }
    core.zoomToMouse(newZoomFactor);
  };

  handleScroll = () => {
    this.props.closeElements(['annotationPopup', 'textPopup', 'annotationNoteConnectorLine', 'formFieldEditPopup']);

    // Show overlay and then hide it, but the hide call is debounced
    this.showPageNavigationOverlay();
    this.debouncedHidePageNavigationOverlay();
  };

  showAndFadeNavigationOverlay = () => {
    this.showPageNavigationOverlay();
    setTimeout(this.hidePageNavigationOverlay, PAGE_NAVIGATION_OVERLAY_FADEOUT);
  };

  hidePageNavigationOverlay = () => {
    this.setState({ showNavOverlay: false });
  };

  showPageNavigationOverlay = () => {
    this.setState({ showNavOverlay: true });
  };

  pageNavOnMouseEnter = () => {
    this.showPageNavigationOverlay();
  };

  pageNavOnMouseLeave = () => {
    this.hidePageNavigationOverlay();
  };

  getClassName = props => {
    const { isSearchOverlayOpen } = props;

    return classNames({
      DocumentContainer: true,
      'search-overlay': isSearchOverlayOpen,
    });
  };

  handleResize() {
    this.updateContainerSize();

    if (!this.props.isReaderMode) {
      // Skip when in reader mode, otherwise will cause error.
      core.setScrollViewElement(this.container.current);
      core.scrollViewUpdated();
    }
  }

  updateContainerSize() {
    const { clientWidth, clientHeight } = this.container.current;
    this.props.setDocumentContainerWidth(clientWidth);
    this.props.setDocumentContainerHeight(clientHeight);
  }

  onTransitionEnd(event) {
    // I don't know if this is needed. But better safe than sorry.
    const transitionProperiesToIgnore = ['background-color', 'opacity'];
    if (!transitionProperiesToIgnore.includes(event.propertyName)) {
      // We have a corner case where if you have 1st and 2nd page different size and you are in fit page mode
      // if you have callout (freetext) annotation on second page. If you open notes panel then click annotation and click
      // edit on it. This will cause our document container to re-render. We also have background-color transition
      // set to all our elements (I believe for having smooth transition to dark mode, not sure though).
      // All this is causing document to run fit page logic and zoom level of this second page jumps out.
      // This is such a corner case, but reported by a customer, we decided do this check here and skip update if
      // background color is the one that causes this transition.
      // This effect is still happening in above case but if instead of clicking edit, user changes width of the notes panel
      // It is currently expected behaviour
      // Note Update after fading page nav was added:
      // This also causes a doc container re-render as we fire the opacity transition when we fade the page nav
      // we must skip updating the scrollViewUpdated call as well or it causes re-renders on docs with different page sizes
      core.scrollViewUpdated();
    }
  }

  render() {
    const {
      leftPanelWidth,
      isLeftPanelOpen,
      isMobile,
      documentContentContainerWidthStyle,
      totalPages,
      isInDesktopOnlyMode,
    } = this.props;

    const documentContainerClassName = isIE ? getClassNameInIE(this.props) : this.getClassName(this.props);
    const documentClassName = classNames({
      document: true,
      hidden: this.props.isReaderMode,
    });
    const showPageNav = totalPages > 1;

    return (
      <div
        style={{
          width: documentContentContainerWidthStyle,
          // we animate with margin-left. For some reason it looks nicer than transform.
          // Using transform makes a clunky animation because the panels are using transform already.
          marginLeft: `${isLeftPanelOpen ? leftPanelWidth : 0}px`,
        }}
        className="document-content-container"
        onTransitionEnd={this.onTransitionEnd}
      >
        <TabsHeader />
        <Measure onResize={this.handleResize}>
          {({ measureRef }) => (
            <div className="measurement-container" ref={measureRef}>
              <div
                className={documentContainerClassName}
                ref={this.container}
                data-element="documentContainer"
                onScroll={this.handleScroll}
              >
                {/* tabIndex="-1" to keep document focused when in single page mode */}
                <div className={documentClassName} ref={this.document} tabIndex="-1" />
              </div>
              {this.props.isReaderMode && <ReaderModeViewer />}
              <MeasurementOverlay />
              <div
                className="footer"
                style={{
                  width: documentContentContainerWidthStyle,
                  marginLeft: `${isLeftPanelOpen ? leftPanelWidth : 0}px`,
                }}
              >
                {showPageNav && (
                  <PageNavOverlay
                    showNavOverlay={this.state.showNavOverlay}
                    onMouseEnter={this.pageNavOnMouseEnter}
                    onMouseLeave={this.pageNavOnMouseLeave}
                  />
                )}

                {isMobile && !isInDesktopOnlyMode && <ToolsOverlay />}
              </div>
            </div>
          )}
        </Measure>
        <div className="custom-container" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  documentContentContainerWidthStyle: selectors.getDocumentContentContainerWidthStyle(state),
  leftPanelWidth: selectors.getLeftPanelWidthWithReszieBar(state),
  isLeftPanelOpen: selectors.isElementOpen(state, 'leftPanel'),
  isRightPanelOpen: selectors.isElementOpen(state, 'searchPanel') || selectors.isElementOpen(state, 'notesPanel'),
  isSearchOverlayOpen: selectors.isElementOpen(state, 'searchOverlay'),
  doesDocumentAutoLoad: selectors.doesDocumentAutoLoad(state),
  zoom: selectors.getZoom(state),
  currentPage: selectors.getCurrentPage(state),
  isHeaderOpen: selectors.isElementOpen(state, 'header') && !selectors.isElementDisabled(state, 'header'),
  displayMode: selectors.getDisplayMode(state),
  totalPages: selectors.getTotalPages(state),
  allowPageNavigation: selectors.getAllowPageNavigation(state),
  isMouseWheelZoomEnabled: selectors.getEnableMouseWheelZoom(state),
  isReaderMode: selectors.isReaderMode(state),
  isInDesktopOnlyMode: selectors.isInDesktopOnlyMode(state),
  isRedactionPanelOpen: selectors.isElementOpen(state, 'redactionPanel'),
  isWv3dPropertiesPanelOpen: selectors.isElementOpen(state, 'wv3dPropertiesPanel'),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  openElement: dataElement => dispatch(actions.openElement(dataElement)),
  closeElements: dataElements => dispatch(actions.closeElements(dataElements)),
  setDocumentContainerWidth: width => dispatch(actions.setDocumentContainerWidth(width)),
  setDocumentContainerHeight: height => dispatch(actions.setDocumentContainerHeight(height)),
});

const ConnectedDocumentContainer = connect(mapStateToProps, mapDispatchToProps)(DocumentContainer);

export default props => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  return <ConnectedDocumentContainer {...props} isMobile={isMobile} />;
};
