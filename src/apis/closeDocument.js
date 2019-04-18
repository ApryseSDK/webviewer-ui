/**
 * Closes the document that's currently opened.
 * @method WebViewer#closeDocument
 * @return {Promise} A promise resolved after document is closed.
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);


instance.closeDocument().then(() => {
  console.log('Document is closed');
});
 */

import core from 'core';

export default ({ dispatch }) => () => core.closeDocument(dispatch);