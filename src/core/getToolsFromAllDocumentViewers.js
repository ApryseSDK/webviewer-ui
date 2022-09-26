import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#getTool__anchor
 */
export default (toolName) => core.getDocumentViewers().map((documentViewer) => documentViewer.getTool(toolName));
