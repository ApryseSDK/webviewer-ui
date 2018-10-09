import core from 'core';
import selectors from 'selectors';
import { documentTypes } from 'constants/types';

export default store => () =>  {
  const state = store.getState();
  const serverUrl = state.advanced.serverUrl || '/annotations';
  const serverUrlHeaders = state.advanced.serverUrlHeaders;
  const docId = state.document.id;
  const docIdQuery = docId ? { did: docId } : {};

  if (selectors.getDocumentType(state) === documentTypes.BLACKBOX) {
    console.warn('Cannot save annotations from WebViewer demo server.');
    return;
  }

  if (serverUrl === '/annotations') {
    console.warn('serverUrl option is not defined. Falling back to `/annotations`, which handles requests in /samples/server.js');
  }

  $.ajax({
    type: 'POST',
    url: serverUrl,
    headers: serverUrlHeaders,
    data: {
      ...docIdQuery,
      'data': core.exportAnnotations()
    },
    success: () => {
      alert(`Annotations saved to /annotations/${docId ? docId : 'default'}.xfdf`);
    }
  });
};
