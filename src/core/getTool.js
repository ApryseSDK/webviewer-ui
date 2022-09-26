import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#getTool__anchor
 */
export default (toolName, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getTool(toolName);
