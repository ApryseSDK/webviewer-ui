import { saveAs } from 'file-saver';
import { getSaveAsHandler } from 'helpers/saveAs';

export default () => (fileMeta) => {
  const { fileData, fileName } = fileMeta;
  if (getSaveAsHandler() !== null) {
    const handler = getSaveAsHandler();
    handler(fileData, fileName);
  } else {
    saveAs(fileData, fileName);
  }
};
