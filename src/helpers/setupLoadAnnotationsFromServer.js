import core from 'core';
import { workerTypes } from 'constants/types';

export default (store) => {
  const state = store.getState();
  let { serverUrl } = state.advanced;
  const { serverUrlHeaders } = state.advanced;

  if (!serverUrl) {
    return;
  }

  const getAnnotsFromServer = (originalData, callback) => {
    const documentId = core.getDocument().getDocumentId();
    if (window.instance.UI.serverFailed) {
      callback(originalData);
      return;
    }
    if (window.instance.UI.loadedFromServer) {
      callback('');
      return;
    }

    // make sure we are not getting cached responses
    if (serverUrl.indexOf('?') === -1) {
      serverUrl += `?_=${Date.now()}`;
    } else {
      serverUrl += `&_=${Date.now()}`;
    }

    if (documentId) {
      serverUrl += `&did=${documentId}`;
    }

    serverUrl = documentId ? `${serverUrl}?did=${documentId}` : serverUrl;

    fetch(serverUrl, {
      headers: serverUrlHeaders,
      credentials: 'include'
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }

        return Promise.reject(response);
      })
      .then((data) => {
        if (data !== null && data !== undefined) {
          window.instance.UI.loadedFromServer = true;
          callback(data);
        } else {
          window.instance.UI.serverFailed = true;
          callback(originalData);
        }
      })
      .catch((e) => {
        window.instance.UI.serverFailed = true;
        console.warn(
          `Error ${e.status}: Annotations could not be loaded from the server.`,
        );
        callback(originalData);
      });
  };

  core.setInternalAnnotationsTransform(getAnnotsFromServer);
  core.setPagesUpdatedInternalAnnotationsTransform(
    (origData, pages, callback) => {
      getAnnotsFromServer(origData, callback);
    },
  );
  core.addEventListener('documentLoaded', function() {
    const documentViewer = core.getDocumentViewer();
    if (documentViewer.getDocument().getType() === workerTypes.OFFICE) {
      getAnnotsFromServer(null, function(data) {
        documentViewer.getAnnotationManager().importAnnotations(data);
      });
    }
  });
};
