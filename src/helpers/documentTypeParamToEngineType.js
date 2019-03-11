import { engineTypes, documentTypes } from 'constants/types';

export default (preloadWorker, pdftronServer) => {
  if (pdftronServer) {
    return engineTypes.PDFTRON_SERVER;
  } else if (preloadWorker === documentTypes.PDF || preloadWorker === documentTypes.OFFICE || preloadWorker === documentTypes.ALL) {
    return engineTypes.PDFNETJS;
  } else if (preloadWorker === documentTypes.XOD) {
    return engineTypes.UNIVERSAL;
  } else {
    return engineTypes.AUTO;
  }
};
