import Feature from 'constants/feature';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import enableFeatures from './enableFeatures';

export default (store) => () => {
  if (isOfficeEditorMode()) {
    console.warn('Office Editor doesn\'t support annotations');
    return;
  }
  enableFeatures(store)([Feature.Annotations]);
};
