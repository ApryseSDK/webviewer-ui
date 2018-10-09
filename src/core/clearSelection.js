/**
 * https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#clearSelection__anchor
 * @fires textSelected on DocumentViewer
 * @see https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#event:textSelected__anchor
 */
export default () => {
	window.docViewer.clearSelection();
};