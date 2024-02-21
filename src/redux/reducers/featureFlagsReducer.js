export default (initialState) => (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'ENABLE_FEATURE_FLAG':
      return { ...state, [payload.featureFlag]: true };
    case 'DISABLE_FEATURE_FLAG':
      return { ...state, [payload.featureFlag]: false };
    default:
      return state;
  }
};