import core from 'core';
import { workerTypes } from 'constants/types';

export default store =>  {
  const state = store.getState();
  const { serverUrl, serverUrlHeaders } = state.advanced;

  if (!serverUrl) {
    return;
  }

  const getAnnotsFromServer = (originalData, callback) => {
    const state = store.getState();
    const { id: documentId } = state.document;

    if (window.readerControl.serverFailed) {
      callback(originalData);
      return;
    } else if (window.readerControl.loadedFromServer) {
      callback('');
      return;
    }

    const docIdQuery = {};
    if (documentId) {
      docIdQuery.did = documentId;
    }

    $.ajax({
      url: serverUrl,
      cache: false,
      data: docIdQuery,
      headers: serverUrlHeaders,
      success: data => {
        if (data !== null && data !== undefined) {
          window.readerControl.loadedFromServer = true;
          callback(data);
        } else {
          window.readerControl.serverFailed = true;
          callback(originalData);
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        window.readerControl.serverFailed = true;
        console.warn('Error ' + jqXHR.status + ' ' + errorThrown + ': Annotations could not be loaded from the server.');
        callback(originalData);
      },
      dataType: 'xml'
    });
  };

  core.setInternalAnnotationsTransform(getAnnotsFromServer);
  core.setPagesUpdatedInternalAnnotationsTransform((origData, pages, callback) => {
    getAnnotsFromServer(origData, callback);
  });
  core.addEventListener('documentLoaded', function() {
    if (window.docViewer.getDocument().getType() === workerTypes.OFFICE) {
      getAnnotsFromServer(null, function(data) {
        window.docViewer.getAnnotationManager().importAnnotations(data);
      });
    }
  });
};
