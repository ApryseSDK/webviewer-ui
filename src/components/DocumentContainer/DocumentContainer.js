import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import actions from 'actions';
import selectors from 'selectors';
import { isMobileSize } from 'helpers/getDeviceSize';
import { connect } from 'react-redux';
import Measure from 'react-measure';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import core from 'core';
import { isIE, isIE11 } from 'helpers/device';
import { updateContainerWidth, getClassNameInIE, handleWindowResize } from 'helpers/documentContainerHelper';
import loadDocument from 'helpers/loadDocument';
import getNumberOfPagesToNavigate from 'helpers/getNumberOfPagesToNavigate';
import touchEventManager from 'helpers/TouchEventManager';
import setCurrentPage from 'helpers/setCurrentPage';
import { getStep } from 'helpers/zoom';
import { removeFileNameExtension } from 'helpers/TabManager';
import { getMinZoomLevel, getMaxZoomLevel } from 'constants/zoomFactors';
import PageNavOverlay from 'components/PageNavOverlay';
import ToolsOverlay from 'components/ToolsOverlay';
import ReaderModeViewer from 'components/ReaderModeViewer';
import LazyLoadWrapper, { LazyLoadComponents } from 'components/LazyLoadWrapper';
import useOnMeasurementToolOrAnnotationSelected from 'hooks/useOnMeasurementToolOrAnnotationSelected';
import useOnCountMeasurementAnnotationSelected from 'hooks/useOnCountMeasurementAnnotationSelected';
import i18next from 'i18next';

import './DocumentContainer.scss';
import DataElements from 'src/constants/dataElement';

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
    isTextEditingPanelOpen: PropTypes.bool,
    isWv3dPropertiesPanelOpen: PropTypes.bool,
    featureFlags: PropTypes.object,
    bottomHeaderHeight: PropTypes.number,
    activeDocumentViewerKey: PropTypes.number,
    isLogoBarEnabled: PropTypes.bool,
    currentTabs: PropTypes.array,
    activeTab: PropTypes.number,
    isSpreadsheetEditorModeEnabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.document = React.createRef();
    this.container = React.createRef();
    this.wheelToNavigatePages = throttle(this.wheelToNavigatePages.bind(this), 300, { trailing: false });
    this.wheelToZoom = throttle(this.wheelToZoom.bind(this), 30, { trailing: false });
    this.handleResize = throttle(this.handleResize.bind(this), 200);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.debouncedHidePageNavigationOverlay = debounce(
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
    this.props.closeElements([DataElements.MULTITABS_EMPTY_PAGE]);

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
    this.props.closeElements([DataElements.MULTITABS_EMPTY_PAGE]);
  }

  preventDefault = (e) => e.preventDefault();

  onDrop = (e) => {
    e.preventDefault();

    const { files } = e.dataTransfer;
    if (files.length) {
      loadDocument(this.props.dispatch, files[0]);
    }
  };

  handleWindowResize = () => {
    handleWindowResize(this.props, this.container.current);
  };

  onWheel = (e) => {
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

      const shouldPreventParentScrolling =
        scrollHeight === clientHeight &&
        ((e.deltaY < 0 && currentPage > 1) || (e.deltaY > 0 && currentPage < totalPages));

      if (shouldPreventParentScrolling) {
        e.preventDefault();
        e.stopPropagation();
      }

      this.wheelToNavigatePages(e, shouldGoUp, shouldGoDown);
      this.props.closeElements(['annotationPopup', 'textPopup', 'annotationNoteConnectorLine', 'inlineCommentPopup']);
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

  wheelToZoom = (e) => {
    const { zoom: currentZoomFactor, activeDocumentViewerKey } = this.props;
    let newZoomFactor = currentZoomFactor;
    if (e.deltaY < 0) {
      newZoomFactor = Math.min(currentZoomFactor + getStep(currentZoomFactor), getMaxZoomLevel());
    } else if (e.deltaY > 0) {
      newZoomFactor = Math.max(currentZoomFactor - getStep(currentZoomFactor), getMinZoomLevel());
    }
    core.zoomToMouse(newZoomFactor, activeDocumentViewerKey, e);
  };

  handleScroll = () => {
    this.props.closeElements(['annotationPopup', 'textPopup', 'inlineCommentPopup', 'annotationNoteConnectorLine']);

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

  getClassName = () => {
    const { isSearchOverlayOpen, isSpreadsheetEditorModeEnabled } = this.props;
    const disablePageScroll = isSpreadsheetEditorModeEnabled;

    return classNames({
      DocumentContainer: true,
      'disable-page-scroll': disablePageScroll,
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
    const { isSpreadsheetEditorModeEnabled } = this.props;
    const { propertyName } = event;
    const standardPropertiesToIgnore = ['background-color', 'opacity', 'scrollbar-color'];
    const spreadsheetSpecificPropertiesToIgnore = ['top', 'left'];
    const isStandardIgnoredProperty = standardPropertiesToIgnore.includes(propertyName);
    const isSpreadsheetSpecificIgnoredProperty =
      isSpreadsheetEditorModeEnabled && spreadsheetSpecificPropertiesToIgnore.includes(propertyName);
    // I don't know if this is needed. But better safe than sorry.
    const isTriggeringUpdate = !(isStandardIgnoredProperty || isSpreadsheetSpecificIgnoredProperty);
    if (isTriggeringUpdate) {
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
      isMultiTabEmptyPageOpen,
      isMobile,
      documentContentContainerWidthStyle,
      totalPages,
      isInDesktopOnlyMode,
      featureFlags,
      bottomHeaderHeight,
      leftHeaderWidth,
      documentContainerLeftMargin,
      currentTabs,
      activeTab
    } = this.props;

    const style = {
      width: documentContentContainerWidthStyle,
      // we animate with margin-left. For some reason it looks nicer than transform.
      // Using transform makes a clunky animation because the panels are using transform already.
      marginLeft: `${documentContainerLeftMargin}px`,
    };
    const documentContainerClassName = isIE ? getClassNameInIE() : this.getClassName();
    const documentClassName = classNames({
      document: true,
      hidden: this.props.isReaderMode,
    });
    const document = core.getDocument();
    const fileName = document ? removeFileNameExtension(document.filename) : '';

    const { customizableUI } = featureFlags;
    const showPageNav = totalPages > 1 && !customizableUI;
    const footerStyle = {
      ...style,
      left: customizableUI ? `${leftHeaderWidth}px` : undefined,
      bottom: `${customizableUI ? bottomHeaderHeight : 0}px`,
    };
    // Calculating its height according to the existing horizontal modular headers
    if (customizableUI) {
      style['height'] = `calc(100% - ${bottomHeaderHeight}px)`;
    }

    const ariaLabelledById = currentTabs.length > 0 ? `tab-${fileName}-${activeTab}` : undefined;

    return (
      <div
        style={style}
        id={`document-container-${fileName}`}
        role="tabpanel"
        aria-labelledby={ariaLabelledById}
        className={classNames({
          'document-content-container': true,
          'closed': isMultiTabEmptyPageOpen,
        })}
        onTransitionEnd={this.onTransitionEnd}
      >
        <Measure onResize={this.handleResize}>
          {({ measureRef }) => (
            <div className="measurement-container" ref={measureRef}>
              <main
                className={documentContainerClassName}
                ref={this.container}
                data-element="documentContainer"
                onScroll={this.handleScroll}
                aria-label={i18next.t('accessibility.landmarks.documentContent')}
              >
                {/* tabIndex="-1" to keep document focused when in single page mode */}
                <div className={documentClassName} ref={this.document} tabIndex="-1" />
              </main>
              {this.props.isReaderMode && <ReaderModeViewer />}
              <LazyLoadWrapper
                Component={LazyLoadComponents.ScaleOverlayContainer}
                dataElement={DataElements.SCALE_OVERLAY_CONTAINER}
                onOpenHook={useOnMeasurementToolOrAnnotationSelected}
              />
              <LazyLoadWrapper
                Component={LazyLoadComponents.MeasurementOverlay}
                dataElement={DataElements.MEASUREMENT_OVERLAY}
                onOpenHook={useOnCountMeasurementAnnotationSelected}
              />
              <div
                className="footer"
                style={footerStyle}
              >
                {showPageNav && (
                  <PageNavOverlay
                    showNavOverlay={this.state.showNavOverlay}
                    onMouseEnter={this.pageNavOnMouseEnter}
                    onMouseLeave={this.pageNavOnMouseLeave}
                    isLogoBarEnabled={this.props.isLogoBarEnabled}
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

const mapStateToProps = (state) => ({
  documentContentContainerWidthStyle: selectors.getDocumentContentContainerWidthStyle(state),
  documentContainerLeftMargin: selectors.getDocumentContainerLeftMargin(state),
  isRightPanelOpen: selectors.isElementOpen(state, 'searchPanel') || selectors.isElementOpen(state, 'notesPanel'),
  isMultiTabEmptyPageOpen: selectors.getIsMultiTab(state) && selectors.getTabs(state).length === 0,
  isSearchOverlayOpen: selectors.isElementOpen(state, DataElements.SEARCH_OVERLAY),
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
  isTextEditingPanelOpen: selectors.isElementOpen(state, 'textEditingPanel'),
  isWv3dPropertiesPanelOpen: selectors.isElementOpen(state, 'wv3dPropertiesPanel'),
  featureFlags: selectors.getFeatureFlags(state),
  bottomHeaderHeight: selectors.getBottomHeadersHeight(state),
  activeDocumentViewerKey: selectors.getActiveDocumentViewerKey(state),
  isLogoBarEnabled: !selectors.isElementDisabled(state, DataElements.LOGO_BAR),
  leftHeaderWidth: selectors.getLeftHeaderWidth(state),
  currentTabs: selectors.getTabs(state),
  activeTab: selectors.getActiveTab(state),
  isSpreadsheetEditorModeEnabled: selectors.isSpreadsheetEditorModeEnabled(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  openElement: (dataElement) => dispatch(actions.openElement(dataElement)),
  closeElements: (dataElements) => dispatch(actions.closeElements(dataElements)),
  setDocumentContainerWidth: (width) => dispatch(actions.setDocumentContainerWidth(width)),
  setDocumentContainerHeight: (height) => dispatch(actions.setDocumentContainerHeight(height)),
});

const ConnectedDocumentContainer = connect(mapStateToProps, mapDispatchToProps)(DocumentContainer);

const ConnectedComponent = (props) => {
  const [isMobile, setIsMobile] = useState(isMobileSize());

  useEffect(() => {
    const onDocumentLoaded = () => {
      if (window.isApryseWebViewerWebComponent) {
        // For the 2nd viewer in multi-webcomponents, we need to delay updating isMobile until the document is loaded
        // A better solution is to elevate useMedia hook but that requires refactoring DocumentContainer into a functional component
        setIsMobile(isMobileSize());
      }
    };
    core.addEventListener('documentLoaded', onDocumentLoaded);
    return () => core.removeEventListener('documentLoaded', onDocumentLoaded);
  }, []);

  return <ConnectedDocumentContainer {...props} isMobile={isMobile} />;
};

export { DocumentContainer as UnconnectedDocumentContainer };
export default ConnectedComponent;
