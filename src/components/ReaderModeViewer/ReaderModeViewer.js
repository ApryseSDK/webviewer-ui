import React from 'react';
// eslint-disable-next-line custom/use-core-hook-in-components
import core from 'core';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import actions from 'actions';
import zoomFactors from 'constants/zoomFactors';
import { connect } from 'react-redux';
import setMaxZoomLevel from 'helpers/setMaxZoomLevel';
import ReaderModeStylePopup from 'components/ReaderModeStylePopup';
import getRootNode from 'helpers/getRootNode';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import './ReaderModeViewer.scss';
import ReaderModePageMode from 'constants/readerModePageMode';

// @pdftron/webviewer-reading-mode is a UMD bundle that expects the lodash webpack extern `_` (used for debounce/throttle) and exposes its API at a shape that depends on the bundler's CJS interop. The two helpers below adapt both expectations to the Vite ESM runtime.
function ensureReadingModeLodashGlobal() {
  window._ = { ...window._, debounce, throttle };
}

function resolveReadingModeApi(mod) {
  return [mod?.default?.default, mod?.default, mod, window.WebViewerReadingMode]
    .find((candidate) => typeof candidate?.initialize === 'function');
}

class ReaderModeViewer extends React.PureComponent {
  static propTypes = {
    containerWidth: PropTypes.number.isRequired,
    enableFadePageNavigation: PropTypes.bool.isRequired,
    readerPageMode: PropTypes.string.isRequired,
    activeDocumentViewerKey: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    this.viewer = React.createRef();
    this.originalMaxZoom = zoomFactors.getMaxZoomLevel();
    this.setAnnotStyleCb = undefined;
    this.doneSetAnnotColorCb = undefined;
    this.originalEnableFadePageNavigation = props.enableFadePageNavigation;
    this.continuousBaseWidth = undefined;

    this.state = {
      colorMapKey: undefined,
      showStylePopup: false,
      style: undefined,
      annotPosition: undefined
    };
  }

  componentDidMount() {
    if (this.props.containerWidth > 0) {
      this.updateMaxZoom();
    }
    this.props.dispatch(actions.disableFadePageNavigationComponent());

    this.renderDocument();

    core.addEventListener('documentLoaded', this.renderDocument, undefined, this.props.activeDocumentViewerKey);
    core.addEventListener('pageNumberUpdated', this.goToPage, undefined, this.props.activeDocumentViewerKey);
    core.addEventListener('zoomUpdated', this.setZoom, undefined, this.props.activeDocumentViewerKey);
    core.addEventListener('toolUpdated', this.setAddAnnotConfig, undefined, this.props.activeDocumentViewerKey);
    core.addEventListener('toolModeUpdated', this.setAddAnnotConfig, undefined, this.props.activeDocumentViewerKey);
  }

  componentWillUnmount() {
    core.removeEventListener('documentLoaded', this.renderDocument, this.props.activeDocumentViewerKey);
    core.removeEventListener('pageNumberUpdated', this.goToPage, this.props.activeDocumentViewerKey);
    core.removeEventListener('zoomUpdated', this.setZoom, this.props.activeDocumentViewerKey);
    core.removeEventListener('toolUpdated', this.setAddAnnotConfig, this.props.activeDocumentViewerKey);
    core.removeEventListener('toolModeUpdated', this.setAddAnnotConfig, this.props.activeDocumentViewerKey);

    this.wvReadingMode?.unmount();

    setMaxZoomLevel(this.props.dispatch)(this.originalMaxZoom);
    if (this.originalEnableFadePageNavigation) {
      this.props.dispatch(actions.enableFadePageNavigationComponent());
    } else {
      this.props.dispatch(actions.disableFadePageNavigationComponent());
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.containerWidth > 0 && prevProps.containerWidth !== this.props.containerWidth) {
      this.updateMaxZoom();
    }

    if (prevProps.readerPageMode !== this.props.readerPageMode) {
      this.continuousBaseWidth = undefined;
      this.setState({
        showStylePopup: false,
        colorMapKey: undefined,
        style: undefined,
        annotPosition: undefined,
      }, this.renderDocument);
    }
  }

  render() {
    return (
      <>
        <div
          className="reader-mode-viewer"
          ref={this.viewer}
        >
        </div>
        {this.state.showStylePopup && (
          <ReaderModeStylePopup
            colorMapKey={this.state.colorMapKey}
            annotationStyle={this.state.style}
            onStyleChange={this.handleColorChange}
            onSliderChange={this.handleOpacityChange}
            onClose={this.handleStylePopupClose}
            annotPosition={this.state.annotPosition}
            viewer={this.viewer}
          />
        )}
      </>
    );
  }

  renderDocument = () => {
    ensureReadingModeLodashGlobal();
    import('@pdftron/webviewer-reading-mode').then((readingModeModule) => {
      const WebViewerReadingMode = resolveReadingModeApi(readingModeModule);
      const isSinglePageMode = this.props.readerPageMode === ReaderModePageMode.SINGLE;
      const documentViewer = core.getDocumentViewer(this.props.activeDocumentViewerKey);
      const rootNode = this.viewer.current?.getRootNode?.() || getRootNode();

      if (!this.wvReadingMode) {
        // eslint-disable-next-line no-undef
        this.wvReadingMode = WebViewerReadingMode.initialize(window.Core.PDFNet);
      } else {
        this.wvReadingMode.unmount();
      }

      this.wvReadingMode.render(
        documentViewer.getDocument().getPDFDoc(),
        this.viewer.current,
        {
          pageNumberUpdateHandler: (pageNumber) => core.setCurrentPage(pageNumber, this.props.activeDocumentViewerKey),
          pageNum: core.getCurrentPage(this.props.activeDocumentViewerKey),
          editStyleHandler: this.onEditStyle,
          rootNode,
          isSinglePageMode
        }
      );
      this.updateReaderModeClass();
      this.setZoom(core.getZoom(this.props.activeDocumentViewerKey));
      this.setAddAnnotConfig();
    });
  };

  updateReaderModeClass = () => {
    const readerModeElement = this.viewer.current?.firstChild;
    if (!readerModeElement) {
      return;
    }

    const isSinglePageMode = this.props.readerPageMode === ReaderModePageMode.SINGLE;
    readerModeElement.classList.toggle('reading-mode--single', isSinglePageMode);
    readerModeElement.classList.toggle('reading-mode--continuous', !isSinglePageMode);
  };

  goToPage = (pageNum) => {
    this.wvReadingMode?.goToPage(pageNum);
  };

  applyPageWidth = (readerModeElement, width) => {
    const pageElements = readerModeElement.querySelectorAll('[id^="read-mode-page-"], [id^="rm-page-"]');
    if (!pageElements.length) {
      return;
    }

    pageElements.forEach((pageElement) => {
      pageElement.style.width = `${width}px`;
      pageElement.style.maxWidth = `${width}px`;
      pageElement.style.margin = '0 auto';
    });
  };

  alignSpinner = (readerModeElement, width) => {
    const spinnerWrapper = readerModeElement.querySelector('.reader-mode-spinner-wrapper');
    if (!spinnerWrapper) {
      return;
    }

    readerModeElement.style.position = 'relative';

    // Force container-relative overlay positioning so spinner tracks doc movement
    // when panels open/close (even if runtime CSS still sets `position: fixed`).
    spinnerWrapper.style.position = 'absolute';
    spinnerWrapper.style.top = '0';
    spinnerWrapper.style.bottom = '0';
    spinnerWrapper.style.left = '50%';
    spinnerWrapper.style.right = 'auto';
    spinnerWrapper.style.transform = 'translateX(-50%)';
    spinnerWrapper.style.width = `${width}px`;
    spinnerWrapper.style.padding = '0';
  };

  setZoom = (zoom) => {
    if (!this.wvReadingMode) {
      return;
    }
    this.wvReadingMode.setZoom(zoom);
    const pageWidth = core.getDocumentViewer(this.props.activeDocumentViewerKey).getPageWidth(1);
    const readerModeElement = this.viewer.current.firstChild;
    if (pageWidth && readerModeElement) {
      const scaledPageWidth = Math.max(0, pageWidth * zoom);
      const isSinglePageMode = this.props.readerPageMode === ReaderModePageMode.SINGLE;
      if (isSinglePageMode) {
        this.styleSinglePageMode(readerModeElement, scaledPageWidth);
      } else {
        this.styleContinousModePages(readerModeElement, scaledPageWidth);
      }
    }
  };

  styleSinglePageMode = (readerModeElement, scaledPageWidth) => {
    const horizontalPadding = Math.max(0, (this.props.containerWidth - scaledPageWidth) / 2);
    readerModeElement.style.padding =  `0 ${horizontalPadding}px`;
    this.alignSpinner(readerModeElement, scaledPageWidth);
  };

  styleContinousModePages = (readerModeElement, scaledPageWidth) => {
    const candidateBaseWidth = Math.max(0, scaledPageWidth);
    this.continuousBaseWidth = this.continuousBaseWidth === undefined
      ? candidateBaseWidth
      : Math.max(this.continuousBaseWidth, candidateBaseWidth);

    const continuousTargetWidth = Math.max(0, Math.min(this.continuousBaseWidth, this.props.containerWidth));
    readerModeElement.style.boxSizing = 'border-box';
    readerModeElement.style.width = `${continuousTargetWidth}px`;
    readerModeElement.style.maxWidth = `${continuousTargetWidth}px`;
    readerModeElement.style.margin = '0 auto';
    readerModeElement.style.padding = '0';

    this.applyPageWidth(readerModeElement, continuousTargetWidth);
    this.alignSpinner(readerModeElement, continuousTargetWidth);
  };

  updateMaxZoom() {
    // Calling the FitWidth function to get the calculated fit width zoom level for normal page rendering
    const documentViewer = core.getDocumentViewer(this.props.activeDocumentViewerKey);
    const maxZoomLevel = documentViewer.FitMode.FitWidth.call(documentViewer);
    setMaxZoomLevel(this.props.dispatch)(maxZoomLevel);
    if (maxZoomLevel < core.getZoom(this.props.activeDocumentViewerKey)) {
      core.fitToWidth(this.props.activeDocumentViewerKey);
    }
    this.setZoom(core.getZoom(this.props.activeDocumentViewerKey));
  }

  getAnnotTypeFromToolMode = (toolMode) => {
    // eslint-disable-next-line no-undef
    const annotationTypes = WebViewerReadingMode.AnnotationType;
    if (toolMode instanceof window.Core.Tools.TextHighlightCreateTool) {
      return annotationTypes.Highlight;
    }
    if (toolMode instanceof window.Core.Tools.TextUnderlineCreateTool) {
      return annotationTypes.Underline;
    }
    if (toolMode instanceof window.Core.Tools.TextStrikeoutCreateTool) {
      return annotationTypes.Strikeout;
    }
    if (toolMode instanceof window.Core.Tools.TextSquigglyCreateTool) {
      return annotationTypes.Squiggly;
    }
    return undefined;
  };

  setAddAnnotConfig = () => {
    if (!this.wvReadingMode) {
      return;
    }
    const toolMode = core.getToolMode(this.props.activeDocumentViewerKey);
    const annotType = this.getAnnotTypeFromToolMode(toolMode);
    if (annotType) {
      this.wvReadingMode.setAddAnnotConfig({
        type: annotType,
        color: toolMode['defaults']['StrokeColor'].toHexString(),
        opacity: toolMode['defaults']['Opacity']
      });
    } else {
      this.wvReadingMode.setAddAnnotConfig({
        type: undefined
      });
    }
  };

  onEditStyle = ({ color, opacity, type, position }, setAnnotStyleCb, doneSetAnnotColorCb) => {
    this.setAnnotStyleCb = setAnnotStyleCb;
    this.doneSetAnnotColorCb = doneSetAnnotColorCb;
    this.setState({
      colorMapKey: this.getColorMapKey(type),
      style: {
        StrokeColor: new window.Core.Annotations.Color(color),
        Opacity: opacity
      },
      showStylePopup: true,
      annotPosition: position
    });
  };

  getColorMapKey(annotType) {
    // eslint-disable-next-line no-undef
    const annotationTypes = WebViewerReadingMode.AnnotationType;
    if (annotType === annotationTypes.Highlight) {
      return 'highlight';
    }
    if (annotType === annotationTypes.Underline) {
      return 'underline';
    }
    if (annotType === annotationTypes.Strikeout) {
      return 'strikeout';
    }
    if (annotType === annotationTypes.Squiggly) {
      return 'squiggly';
    }
    return '';
  }

  handleColorChange = (property, color) => {
    if (property === 'StrokeColor' && this.setAnnotStyleCb) {
      this.setAnnotStyleCb({
        color: color.toHexString(),
        opacity: this.state.style.Opacity
      });
      this.setState({
        style: {
          ...this.state.style,
          StrokeColor: color
        }
      });
    }
  };

  handleOpacityChange = (property, opacity) => {
    if (property === 'Opacity' && this.setAnnotStyleCb) {
      this.setAnnotStyleCb({
        color: this.state.style.StrokeColor.toHexString(),
        opacity
      });
      this.setState({
        style: {
          ...this.state.style,
          Opacity: opacity
        }
      });
    }
  };

  handleStylePopupClose = () => {
    this.setState({
      showStylePopup: false
    });
    this.doneSetAnnotColorCb();
  };
}

const mapStateToProps = (state) => ({
  containerWidth: selectors.getDocumentContainerWidth(state),
  enableFadePageNavigation: selectors.shouldFadePageNavigationComponent(state),
  readerPageMode: selectors.getReaderPageMode(state),
  activeDocumentViewerKey: selectors.getActiveDocumentViewerKey(state)
});

export default connect(mapStateToProps)(ReaderModeViewer);
