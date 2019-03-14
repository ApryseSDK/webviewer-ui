import { engineTypes, workerTypes } from 'constants/types';

export default (preloadWorker, pdftronServer) => {
  if (pdftronServer) {
    return engineTypes.PDFTRON_SERVER;
  // } else if (preloadWorker === workerTypes.PDF || preloadWorker === workerTypes.OFFICE || preloadWorker === workerTypes.ALL) {
  //   return engineTypes.PDFNETJS;
  // } else if (preloadWorker === workerTypes.XOD) {
  //   return engineTypes.UNIVERSAL;
  } else {
    return engineTypes.AUTO;
  }
};
