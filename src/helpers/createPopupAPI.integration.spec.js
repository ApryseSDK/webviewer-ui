import createPopupAPI from './createPopupAPI';

import actions from 'actions';
import selectors from 'selectors';


import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';


describe('createPopupAPI + Redux integration', () => {
  const popup = 'contextMenuPopup';
  let store;

  beforeEach(() => {
    store = configureStore({ reducer: rootReducer });
  });

  const itemsOfPopup = () => selectors.getPopupItems(store.getState(), popup);

  test('add inserts via reducer and selector sees it', () => {
    // seed current items through the real action/reducer
    store.dispatch(actions.setPopupItems(popup, [{ dataElement: 'a' }, { dataElement: 'b' }]));

    const api = createPopupAPI(store, popup);
    api.add({ dataElement: 'x', type: 'actionButton' }, 'a');

    expect(itemsOfPopup()).toEqual([
      { dataElement: 'a' },
      { dataElement: 'x', type: 'actionButton' },
      { dataElement: 'b' },
    ]);
  });

  test('update replaces all items through reducer', () => {
    const api = createPopupAPI(store, popup);
    api.update([{ dataElement: 'stylePopup' }]);

    expect(itemsOfPopup()).toEqual([{ dataElement: 'stylePopup' }]);
  });

  test('update with no args clears items', () => {
    const api = createPopupAPI(store, popup);
    api.update();

    expect(itemsOfPopup()).toEqual([]); // selector should reflect the cleared array
  });
});