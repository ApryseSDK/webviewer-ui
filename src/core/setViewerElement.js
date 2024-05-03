import core from 'core';

/**
 * @see componentDidMount in DocumentContainer.js about how to use this api
 */
export default (element, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).setViewerElement(element);
};
