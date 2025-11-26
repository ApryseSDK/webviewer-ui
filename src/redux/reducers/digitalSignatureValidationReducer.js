export default (initialState) => (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_VALIDATION_MODAL_WIDGET_NAME':
      return {
        ...state,
        validationModalWidgetName: payload.validationModalWidgetName,
      };
    case 'SET_VERIFICATION_RESULT':
      return { ...state, verificationResult: payload.result };
    case 'ADD_TRUSTED_CERTIFICATES':
      /**
       * To mimic the behavior of the Core implementation, where certificates
       * can only be added but not removed, only allow this action to append
       * to the existing array
       */
      return {
        ...state,
        certificates: [...state.certificates, ...payload.certificates],
      };
    case 'SET_TRUST_LIST_KEY':
      return {
        ...state,
        trustListKey: payload.trustListKey,
      };
    case 'SET_IS_REVOCATION_CHECKING_ENABLED':
      return {
        ...state,
        isRevocationCheckingEnabled: payload.isRevocationCheckingEnabled,
      };
    case 'SET_REVOCATION_PROXY_PREFIX':
      return {
        ...state,
        revocationProxyPrefix: payload.revocationProxyPrefix,
      };
    default:
      return state;
  }
};
