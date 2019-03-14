import { engineTypes, workerTypes } from 'constants/types';

export default (documentType, pdftronServer) => {
  if (pdftronServer) {
    return engineTypes.PDFTRON_SERVER;
  } else if (documentType === workerTypes.PDF || documentType === workerTypes.OFFICE || documentType === workerTypes.ALL) {
    return engineTypes.PDFNETJS;
  } else if (documentType === workerTypes.XOD) {
    return engineTypes.UNIVERSAL;
  } else {
    return engineTypes.AUTO;
  }
};
