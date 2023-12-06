import getRootNode from 'helpers/getRootNode';

export default () => {
  getRootNode().querySelector('#office-editor-file-picker')?.click();
};
