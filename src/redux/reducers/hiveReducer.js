export default initialState => (state = initialState, action) => {
  const { type, payload } = action;

  switch(type) {
    case 'SET_AT_MENTIONS':
      return { ...state, atMentions: payload.atMentions };
    default:
      return state;
  }
};
