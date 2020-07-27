import React from 'react';
import core from 'core';
import WebViewerReadingMode from '@pdftron/webviewer-reading-mode';

class ReaderModeViewer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.viewer = React.createRef();

    this.renderDocument = this.renderDocument.bind(this);
    this.goToPage = this.goToPage.bind(this);
  }

  componentDidMount() {
    this.renderDocument();

    core.getDocumentViewer().on('documentLoaded', this.renderDocument);
    core.getDocumentViewer().on('pageNumberUpdated', this.goToPage);
  }

  componentWillUnmount() {
    core.getDocumentViewer().off('documentLoaded', this.renderDocument);
    core.getDocumentViewer().off('pageNumberUpdated', this.goToPage);
  }

  render() {
    return (
      <div
        className="reader-mode-viewer"
        ref={this.viewer}
        style={{ height: "100%", width: "500px" }}
      >
      </div>
    );
  }

  renderDocument() {
    WebViewerReadingMode.render(
      core.getDocumentViewer().getDocument().getPDFDoc(),
      this.viewer.current,
      PDFNet,
      core.setCurrentPage
    );
  }

  goToPage(pageNum) {
    WebViewerReadingMode.goToPage(this.viewer.current, pageNum);
  }
}

export default ReaderModeViewer;
