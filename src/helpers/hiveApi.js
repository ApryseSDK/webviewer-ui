// Custom Hive API
const hiveApi = {
  onDownloadFile: (...args) => console.warn('Not implemented Hive API: onDownloadFile', args),
  onUploadFile: (...args) => console.warn('Not implemented Hive API: onUploadFile', args),
  onAtMentions: (...args) => console.warn('Not implemented  Hive API: onAtMentions', args),
  isEditingAnnotations: {},
};

let HiveAPI = hiveApi;

document.addEventListener('ready', () => {
  HiveAPI = window.readerControl?.hiveApi;
});

export { HiveAPI };
export default hiveApi;
