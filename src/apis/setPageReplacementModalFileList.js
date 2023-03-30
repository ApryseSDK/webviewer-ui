import actions from 'actions';
/**
 * Add a list of documents to the dropdown element of Page Replacement modal and provide a
 * way to retreive document for displaying Page Replacement modal.
 * @method UI.setPageReplacementModalFileList
 * @param {Array} list An array of object for selection element. Object must have "id", "filename" properties and "onSelect" method.
 * @example
WebViewer(...)
  .then(function(instance) {
    const list = [
      {id: '12', filename: 'file-one.pdf'},
      {id: '13', filename: 'file-two.pdf'},
      {id: '14', filename: 'foobar.pdf'}
    ];

    const options = list.map(item => {
      // Add "onSelect" method to each item, and return Document instance
      item.onSelect = () => instance.Core.createDocument('https://localhost/files/webviewer-demo.pdf');
      return item;
    });

    instance.UI.setPageReplacementModalFileList(options);
  });
 */

export default (store) => (list) => {
  if (Array.isArray(list)) {
    if (!list.every(isValidObject)) {
      return console.warn(
        'An array is passed to setPageReplacementModalFileList is invalid'
      );
    }
  }

  store.dispatch(actions.setPageReplacementModalFileList(list));
};

const isValidObject = (item) => {
  return Object.prototype.hasOwnProperty.call(item, 'id')
    || Object.prototype.hasOwnProperty.call(item, 'filename')
    || Object.prototype.hasOwnProperty.call(item, 'onSelect')
    || typeof item.onSelect === 'function';
};