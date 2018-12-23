import addSortStrategy from './addSortStrategy';

export default store => newSort => {
  addSortStrategy(store)(newSort);

  console.warn('setNotesPanelSort is going to be deprecated, please use addSortStrategy instead');
};
