import getRootNode from 'helpers/getRootNode';

export default () => {
  getRootNode().querySelector('#file-picker')?.click();
};
