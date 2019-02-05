import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as internalActions from 'actions/internalActions';
import initialState from 'src/redux/initialState.js';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore(initialState);

describe('internalActions', () => {
  
  beforeEach(() => {
    store.clearActions();
  });

  test('disableElement stylePopup', () => {
    store.dispatch(internalActions.disableElement('stylePopup', 1));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElements: ['toolStylePopup', 'annotationStylePopup'],
        priority: 1
      },
      type: 'DISABLE_ELEMENTS'
    });
  });
  test('disableElement not stylePopup', () => {
    store.dispatch(internalActions.disableElement('notesPanel',1));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElement: 'notesPanel',
        priority: 1
      },
      type: 'DISABLE_ELEMENT'
    });
  });

  test('disableElements', () => {
    store.dispatch(internalActions.disableElements(['stylePopup'], 1));
    const actions = store.getActions();
    expect(actions[0]).toEqual({ 
      payload: {
        dataElements: ['stylePopup'],
        priority: 1
      },
      type: 'DISABLE_ELEMENTS' 
    });
  });

  test('enableElement stylePopup', () => {
    store.dispatch(internalActions.enableElement('stylePopup', 1));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElements: ['toolStylePopup', 'annotationStylePopup'],
        priority: 1
      },
      type: 'ENABLE_ELEMENTS'
    });
  });

  test('enableElement not stylePopup', () => {
    store.dispatch(internalActions.enableElement('stylePopup', 1));
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      payload: {
        dataElements: ['toolStylePopup', 'annotationStylePopup'],
        priority: 1
      },
      type: 'ENABLE_ELEMENTS'
    });
  });
});





// const expectedAction = [{
//   type: 'DISABLE_ELEMENTS',
//   payload: {}
// }];
// store.dispatch(internalActions.disableElements('sample','sample'));
// expect(store.getActions()).toEqual(expectedAction); 