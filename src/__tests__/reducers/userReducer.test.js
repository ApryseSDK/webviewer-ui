import userReducer from 'reducers/userReducer';
import initialState from 'src/redux/initialState.js';

describe('userReducer', () => {
  
  test('SET_USER_NAME', () => {
    const action = { type: 'SET_USER_NAME', payload: { userName: 'test' } };
    const expectedState = { ...initialState.user, name: 'test' };
    expect(userReducer(initialState.user)(undefined, action)).toEqual(expectedState);
  });

  test('SET_ADMIN_USER', () => {
    const action = { type: 'SET_ADMIN_USER', payload: { isAdminUser: 'test' } };
    const expectedState = { ...initialState.user, isAdmin: 'test' };
    expect(userReducer(initialState.user)(undefined, action)).toEqual(expectedState);
  });

});