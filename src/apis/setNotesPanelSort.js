import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import addSortStrategy from './addSortStrategy';

export default store => newStrategy => {
  warnDeprecatedAPI(
    'setNotesPanelSort',
    'addSortStrategy',
    '7.0',
  );
  addSortStrategy(store)(newStrategy);
};
