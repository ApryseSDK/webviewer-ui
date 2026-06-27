import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getTool__anchor
 */
export default (toolName, documentViewerKey) => core.getDocumentViewer(documentViewerKey).getTool(toolName);
