export default initialState => (state = initialState, action) => {
  const { type, payload } = action;

  switch(type) {
    case 'SET_USER_NAME':
      return { ...state, name: payload.userName };
    case 'SET_ADMIN_USER':
      return { ...state, isAdmin: payload.isAdminUser };
    default:
      return state;
  }
};