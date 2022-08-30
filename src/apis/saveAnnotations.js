import core from 'core';

export default (store) => () => new Promise((resolve, reject) => {
  const state = store.getState();
  const { id: docId } = state.document;
  const { serverUrl, serverUrlHeaders } = state.advanced;
  const docIdQuery = docId ? { did: docId } : {};

  if (!serverUrl) {
    console.warn('serverUrl option is not defined. Please pass this option in WebViewer constructor to save/load annotations. See https://www.pdftron.com/documentation/web/guides/annotations/saving-loading-annotations for details.');
    reject();
    return;
  }

  core.exportAnnotations((xfdfString) => {
    fetch(serverUrl, {
      method: 'POST',
      headers: serverUrlHeaders,
      body: {
        ...docIdQuery,
        data: xfdfString,
      },
      credentials: 'include'
    }).then((response) => {
      if (response.ok) {
        resolve();
      } else {
        reject(response);
      }
    }).catch(reject);
  });
});
