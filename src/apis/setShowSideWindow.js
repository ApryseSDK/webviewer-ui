import setSideWindowVisibility from './setSideWindowVisibility';

export default store => value => {
  setSideWindowVisibility(store)(value);
};
