import Feature from 'constants/feature';
import disableFeatures from './disableFeatures';

export default store => () => {
  disableFeatures(store)([Feature.Download]);
};
