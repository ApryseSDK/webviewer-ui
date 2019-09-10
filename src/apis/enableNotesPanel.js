import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';
import disableFeatures from './disableFeatures';

export default store => (enable = true) => {
  if (enable) {
    warnDeprecatedAPI(
      'enableNotesPanel()',
      'enableFeatures([instance.Feature.NotesPanel])',
      '7.0',
    );
    enableFeatures(store)([Feature.NotesPanel]);
  } else {
    warnDeprecatedAPI(
      'enableNotesPanel(false)',
      'disableFeatures([instance.Feature.NotesPanel])',
      '7.0',
    );
    disableFeatures(store)([Feature.NotesPanel]);
  }
};