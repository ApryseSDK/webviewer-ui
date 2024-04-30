import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getTool__anchor
 */
export default (toolName) => core.getDocumentViewers().map((documentViewer) => documentViewer.getTool(toolName));
