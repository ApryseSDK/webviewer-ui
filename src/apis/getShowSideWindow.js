import getSideWindowVisibility from './getSideWindowVisibility';

export default (store) => () => {
  return getSideWindowVisibility(store)();
};
