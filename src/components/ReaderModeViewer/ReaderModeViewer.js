import React from 'react';
import core from 'core';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import actions from 'actions';
import zoomFactors from 'constants/zoomFactors';
import { connect } from 'react-redux';
import setMaxZoomLevel from 'helpers/setMaxZoomLevel';
import ReaderModeStylePopup from 'components/ReaderModeStylePopup';

class ReaderModeViewer extends React.PureComponent {
  static propTypes = {
    containerWidth: PropTypes.number.isRequired,
    enableFadePageNavigation: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);

    this.viewer = React.createRef();
    this.originalMaxZoom = zoomFactors.getMaxZoomLevel();
    this.setAnnotStyleCb = undefined;
    this.doneSetAnnotColorCb = undefined;
    this.originalEnableFadePageNavigation = props.enableFadePageNavigation;

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

    core.addEventListener('documentLoaded', this.renderDocument);
    core.addEventListener('pageNumberUpdated', this.goToPage);
    core.addEventListener('zoomUpdated', this.setZoom);
    core.addEventListener('toolUpdated', this.setAddAnnotConfig);
    core.addEventListener('toolModeUpdated', this.setAddAnnotConfig);
  }

  componentWillUnmount() {
    core.removeEventListener('documentLoaded', this.renderDocument);
    core.removeEventListener('pageNumberUpdated', this.goToPage);
    core.removeEventListener('zoomUpdated', this.setZoom);
    core.removeEventListener('toolUpdated', this.setAddAnnotConfig);
    core.removeEventListener('toolModeUpdated', this.setAddAnnotConfig);

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
  }

  render() {
    return (
      <>
        <div
          className="reader-mode-viewer"
          ref={this.viewer}
          style={{ height: "100%", width: "100%" }}
        >
        </div>
        {this.state.showStylePopup && (
          <ReaderModeStylePopup
            colorMapKey={this.state.colorMapKey}
            style={this.state.style}
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
    import('@pdftron/webviewer-reading-mode').then(({ default: WebViewerReadingMode }) => {
      if (!this.wvReadingMode) {
        this.wvReadingMode = WebViewerReadingMode.initialize(PDFNet);
      } else {
        this.wvReadingMode.unmount();
      }

      this.wvReadingMode.render(
        core.getDocumentViewer().getDocument().getPDFDoc(),
        this.viewer.current,
        {
          pageNumberUpdateHandler: core.setCurrentPage,
          pageNum: core.getCurrentPage(),
          editStyleHandler: this.onEditStyle
        }
      );
      this.setZoom(core.getZoom());
      this.setAddAnnotConfig();
    });
  }

  goToPage = (pageNum) => {
    this.wvReadingMode?.goToPage(pageNum);
  }

  setZoom = (zoom) => {
    if (!this.wvReadingMode) return;
    this.wvReadingMode.setZoom(zoom);
    const pageWidth = core.getDocumentViewer().getPageWidth(1);
    const readerModeElement = this.viewer.current.firstChild;
    if (pageWidth && readerModeElement) {
      readerModeElement.style.padding = `0 ${(this.props.containerWidth - pageWidth * zoom) / 2}px`;
    }
  }

  updateMaxZoom() {
    // Calling the FitWidth function to get the calculated fit width zoom level for normal page rendering
    const maxZoomLevel = core.getDocumentViewer().FitMode.FitWidth.call(core.getDocumentViewer());
    setMaxZoomLevel(this.props.dispatch)(maxZoomLevel);
    if (maxZoomLevel < core.getZoom()) {
      core.fitToWidth();
    }
    this.setZoom(core.getZoom());
  }

  getAnnotTypeFromToolMode = (toolMode) => {
    if (toolMode instanceof window.Core.Tools.TextHighlightCreateTool) {
      return WebViewerReadingMode.AnnotationType.Highlight;
    } else if (toolMode instanceof window.Core.Tools.TextUnderlineCreateTool) {
      return WebViewerReadingMode.AnnotationType.Underline;
    } else if (toolMode instanceof window.Core.Tools.TextStrikeoutCreateTool) {
      return WebViewerReadingMode.AnnotationType.Strikeout;
    } else if (toolMode instanceof window.Core.Tools.TextSquigglyCreateTool) {
      return WebViewerReadingMode.AnnotationType.Squiggly;
    }
    return undefined;
  }

  setAddAnnotConfig = () => {
    if (!this.wvReadingMode) return;
    const toolMode = core.getToolMode();
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
  }

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
  }

  getColorMapKey(annotType) {
    if (annotType === WebViewerReadingMode.AnnotationType.Highlight) {
      return 'highlight';
    } else if (annotType === WebViewerReadingMode.AnnotationType.Underline) {
      return 'underline';
    } else if (annotType === WebViewerReadingMode.AnnotationType.Strikeout) {
      return 'strikeout';
    } else if (annotType === WebViewerReadingMode.AnnotationType.Squiggly) {
      return 'squiggly';
    }
    return "";
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
  }

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
  }

  handleStylePopupClose = () => {
    this.setState({
      showStylePopup: false
    });
    this.doneSetAnnotColorCb();
  }
}

const mapStateToProps = state => ({
  containerWidth: selectors.getDocumentContainerWidth(state),
  enableFadePageNavigation: selectors.shouldFadePageNavigationComponent(state)
});

export default connect(mapStateToProps)(ReaderModeViewer);
