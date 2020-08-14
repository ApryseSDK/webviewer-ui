import React from 'react';
import core from 'core';

class ReaderModeViewer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.viewer = React.createRef();
    this.originalMaxZoom = window.readerControl.getMaxZoomLevel();

    this.renderDocument = this.renderDocument.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.setZoom = this.setZoom.bind(this);
  }

  componentDidMount() {
    if (this.props.containerWidth > 0) {
      this.updateMaxZoom();
    }

    this.renderDocument();

    core.addEventListener('documentLoaded', this.renderDocument);
    core.addEventListener('pageNumberUpdated', this.goToPage);
    core.addEventListener('zoomUpdated', this.setZoom);
  }

  componentWillUnmount() {
    core.removeEventListener('documentLoaded', this.renderDocument);
    core.removeEventListener('pageNumberUpdated', this.goToPage);
    core.removeEventListener('zoomUpdated', this.setZoom);

    window.readerControl.setMaxZoomLevel(this.originalMaxZoom);
  }

  componentDidUpdate(prevProps) {
    if (this.props.containerWidth > 0 && prevProps.containerWidth !== this.props.containerWidth) {
      this.updateMaxZoom();
    }
  }

  render() {
    return (
      <div
        className="reader-mode-viewer"
        ref={this.viewer}
        style={{ height: "100%" }}
      >
      </div>
    );
  }

  renderDocument() {
    import('@pdftron/webviewer-reading-mode').then(({ default: WebViewerReadingMode }) => {
      if (!this.wvReadingMode) {
        this.wvReadingMode = WebViewerReadingMode.initialize(PDFNet);
      }

      this.wvReadingMode.render(
        core.getDocumentViewer().getDocument().getPDFDoc(),
        this.viewer.current,
        core.setCurrentPage
      );
      this.setZoom(window.readerControl.getZoomLevel());
    });
  }

  goToPage(pageNum) {
    this.wvReadingMode?.goToPage(pageNum);
  }

  setZoom(zoom) {
    this.wvReadingMode?.setZoom(zoom);
    const pageWidth = core.getDocumentViewer().getPageWidth(1);
    if (pageWidth) {
      this.viewer.current.style.width = `${pageWidth * zoom}px`;
    }
  }

  updateMaxZoom() {
    const maxZoomLevel = core.getDocumentViewer().FitMode.FitWidth.call(core.getDocumentViewer());
    window.readerControl.setMaxZoomLevel(maxZoomLevel);

    const zoomLevel = window.readerControl.getZoomLevel();
    if (maxZoomLevel < zoomLevel) {
      window.readerControl.setZoomLevel(maxZoomLevel);
    }
  }
}

export default ReaderModeViewer;
