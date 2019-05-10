import { engineTypes, workerTypes } from 'constants/types';

export default (preloadWorker, pdftronServer) => {
  if (pdftronServer) {
    return engineTypes.PDFTRON_SERVER;
  } else {
    return engineTypes.AUTO;
  }
};
