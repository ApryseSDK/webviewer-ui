import advancedReducer from 'reducers/advancedReducer';
import initialState from 'src/redux/initialState.js';

describe('advancedReducer', () => {

  test('SET_STREAMING', () => {
    const action = { type: 'SET_STREAMING', payload: { streaming: 'test' } };
    const expectedState = { ...initialState.advanced, streaming: 'test' };
    expect(advancedReducer(initialState.advanced)(undefined, action)).toEqual(expectedState);
  });

  test('SET_DECRYPT_FUNCTION', () => {
    const action = { type: 'SET_DECRYPT_FUNCTION', payload: { decryptFunction: 'test' } };
    const expectedState = { ...initialState.advanced, decrypt: 'test' };
    expect(advancedReducer(initialState.advanced)(undefined, action)).toEqual(expectedState);
  });

  test('SET_DECRYPT_OPTIONS', () => {
    const action = { type: 'SET_DECRYPT_OPTIONS', payload: { decryptOptions: 'test' } };
    const expectedState = { ...initialState.advanced, decryptOptions: 'test' };
    expect(advancedReducer(initialState.advanced)(undefined, action)).toEqual(expectedState);
  });

  test('SET_ENGINE_TYPE', () => {
    const action = { type: 'SET_ENGINE_TYPE', payload: { type: 'test' } };
    const expectedState = { ...initialState.advanced, engineType: 'test'};
    expect(advancedReducer(initialState.advanced)(undefined, action)).toEqual(expectedState);
  });

  test('SET_CUSTOM_HEADERS', () => {
    const action = { type: 'SET_CUSTOM_HEADERS', payload: { customHeaders: 'test' } };
    const expectedState = { ...initialState.advanced, customHeaders: 'test' };
    expect(advancedReducer(initialState.advanced)(undefined, action)).toEqual(expectedState);
  });

  test('SET_WITH_CREDENTIALS', () => {
    const action = { type: 'SET_WITH_CREDENTIALS', payload: { withCredentials: 'test' } };
    const expectedState = { ...initialState.advanced, withCredentials: 'test' };
    expect(advancedReducer(initialState.advanced)(undefined, action)).toEqual(expectedState);
  });
});