import core from 'core';

/**
 * @see componentDidMount in DocumentContainer.js about how to use this api
 */
export default (element, documentViewerKey) => {
  core.getDocumentViewer(documentViewerKey).setScrollViewElement(element);
};
