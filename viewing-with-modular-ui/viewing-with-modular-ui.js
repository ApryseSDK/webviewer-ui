/* eslint-disable no-undef */
// @link WebViewerInstance: https://docs.apryse.com/api/web/WebViewerInstance.html
// @link UI.loadDocument: https://docs.apryse.com/api/web/UI.html#loadDocument__anchor

WebViewer.WebComponent(
  {
    path: '../../../lib',
    initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
    ui: 'beta',
  },
  document.getElementById('viewer')
).then((instance) => {
  document.getElementById('select').onchange = (e) => {
    instance.UI.loadDocument(e.target.value);
  };

  document.getElementById('file-picker').onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      instance.UI.loadDocument(file);
    }
  };

  document.getElementById('url-form').onsubmit = (e) => {
    e.preventDefault();
    instance.UI.loadDocument(document.getElementById('url').value);
  };
});