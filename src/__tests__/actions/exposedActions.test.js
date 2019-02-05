import configureStore from 'redux-mock-store';

import * as exposedActions from 'actions/exposedActions';

const mockStore = configureStore();
const store = mockStore();

describe('exposedActions', () => {
  
  beforeEach(() => {
    store.clearActions();
  });

  test('enableAllElements', () => {
    const expectedAction = [{
      payload: {},
       type: 'ENABLE_ALL_ELEMENTS'
      }];
    store.dispatch(exposedActions.enableAllElements());
    expect(store.getActions()).toEqual(expectedAction); 
  });

  // test('openElement', () => {
  //   const expectedAction = [{
  //     payload: {'samplePayload':'test'},
  //     type: 
  //   }]
  // });
});