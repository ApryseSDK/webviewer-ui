import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableFeatures from './disableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'disableNotesPanel()',
    'disableFeatures([instance.Feature.NotesPanel])',
    '7.0',
  );
  disableFeatures(store)([Feature.NotesPanel]);
};
