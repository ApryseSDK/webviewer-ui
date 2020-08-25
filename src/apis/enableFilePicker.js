import Feature from 'constants/feature';
import enableFeatures from './enableFeatures';
import disableFeatures from './disableFeatures';

export default store => (enable = true) => {
  if (enable) {
    enableFeatures(store)([Feature.FilePicker]);
  } else {
    disableFeatures(store)([Feature.FilePicker]);
  }
};