import viewerReducer from 'reducers/viewerReducer';
import initialState from 'src/redux/initialState.js';

describe('viewerReducer', () => {
  test('Initial state is unchanged', () => {
    const action = { type: 'sample', payload: 'sample' };    
    expect(viewerReducer(initialState)(undefined, action)).toEqual(initialState);
  });

  test('Disable element', () => {
    const action = { type: 'DISABLE_ELEMENT', payload: { dataElement:'freeHandToolGroupButton', priority: 'high'}};
    const expectedState = { ...initialState, disabledElements: {...initialState.disabledElements, ['freeHandToolGroupButton']: {disabled: true, priority: 'high'}}};

    expect(viewerReducer(initialState)(undefined, action)).toEqual(expectedState);
  });
});