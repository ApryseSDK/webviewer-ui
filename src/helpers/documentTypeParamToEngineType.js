import { engineTypes, documentTypes } from 'constants/types';

export default (documentType, pdftronServer) => {
  if (pdftronServer) {
    return engineTypes.PDFTRON_SERVER;
  } else if (documentType === documentTypes.PDF || documentType === documentTypes.OFFICE || documentType === documentTypes.ALL) {
    return engineTypes.PDFNETJS;
  } else if (documentType === documentTypes.XOD) {
    return engineTypes.UNIVERSAL;
  } else {
    return engineTypes.AUTO;
  }
};
