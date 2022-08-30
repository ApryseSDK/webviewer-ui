import Feature from 'constants/feature';
import enableFeatures from './enableFeatures';

export default (store) => () => {
  enableFeatures(store)([Feature.LocalStorage]);
};