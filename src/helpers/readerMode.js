import actions from 'actions';
import enableFeatures from 'src/apis/enableFeatures';
import disableFeatures from 'src/apis/disableFeatures';
import Feature from 'constants/feature';
import { PRIORITY_ONE } from 'constants/actionPriority';

const features = [Feature.Annotations, Feature.Download, Feature.Print, Feature.Search];
const dataElements = ['panToolButton', 'selectToolButton', 'outlinesPanelButton', 'bookmarksPanelButton'];

export const enterReaderMode = store => {
  store.dispatch(actions.setReaderMode(true));
  disableFeatures(store)(features);
  store.dispatch(actions.disableElements(dataElements, PRIORITY_ONE));
};

export const exitReaderMode = store => {
  store.dispatch(actions.setReaderMode(false));
  enableFeatures(store)(features);
  store.dispatch(actions.enableElements(dataElements, PRIORITY_ONE));
};