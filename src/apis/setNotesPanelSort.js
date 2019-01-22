import addSortStrategy from './addSortStrategy';

export default store => newStrategy => {
  addSortStrategy(store)(newStrategy);

  console.warn('setNotesPanelSort is deprecated, please use addSortStrategy instead');
};
