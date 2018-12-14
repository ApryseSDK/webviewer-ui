import core from 'core';

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
    } else if (window.readerControl.loadedFromServer) {
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
        if (!_.isNull(data) && !_.isUndefined(data)) {
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
};
