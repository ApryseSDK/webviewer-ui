import addSortStrategy from './addSortStrategy';

export default store => newStrategy => {
  addSortStrategy(store)(newStrategy);
};
