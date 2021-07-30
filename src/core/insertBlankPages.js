/**
 * https://www.pdftron.com/api/web/Core.Document.html#insertblankpages
 */
export default (insertBeforeThesePages, width, height) => window.documentViewer.getDocument().insertBlankPages(insertBeforeThesePages, width, height);