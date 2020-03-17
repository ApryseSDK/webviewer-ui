import { saveAs } from 'file-saver';

export default () => fileMeta => {
  const { fileData, fileName } = fileMeta;
  saveAs(fileData, fileName);
};
