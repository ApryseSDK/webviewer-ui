import core from 'core';

export default store => () =>  {
  const state = store.getState();
  const { id: docId } = state.document;
  const { serverUrl, serverUrlHeaders } = state.advanced;
  const docIdQuery = docId ? { did: docId } : {};

  if (!serverUrl) {
    console.warn('serverUrl option is not defined. Please pass this option in WebViewer constructor to save/load annotations. See https://www.pdftron.com/documentation/web/guides/annotations/saving-loading-annotations for details.');
    return;
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
      alert(`Annotations saved to ${serverUrl}/${docId ? docId : 'default'}.xfdf`);
    }
  });
};
