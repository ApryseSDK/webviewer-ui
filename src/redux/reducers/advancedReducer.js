export default initialState => (state = initialState, action) => {
  const { type, payload } = action;

  switch(type) {
    case 'SET_STREAMING':
      return { ...state, streaming: payload.streaming };
    case 'SET_DECRYPT_FUNCTION':
      return { ...state, decrypt: payload.decryptFunction };
    case 'SET_DECRYPT_OPTIONS':
      return { ...state, decryptOptions: payload.decryptOptions };
    case 'SET_ENGINE_TYPE':
      return { ...state, engineType: payload.type };
    case 'SET_CUSTOM_HEADERS':
      return { ...state, customHeaders: payload.customHeaders };
    default:
      return state;
  }
};