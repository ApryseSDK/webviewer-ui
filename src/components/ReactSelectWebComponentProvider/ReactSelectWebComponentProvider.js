import React from 'react';
import { NonceProvider } from 'react-select';
import createCache from '@emotion/cache';
import getRootNode from 'helpers/getRootNode';

class EmotionNonceProvider extends NonceProvider {
  createEmotionCache = (nonce) => {
    return createCache({ nonce, container: this.props.container });
  };
}

const ReactSelectWebComponentProvider = ({ children }) => (
  window.isApryseWebViewerWebComponent ?
    <EmotionNonceProvider container={getRootNode()}>
      {children}
    </EmotionNonceProvider>
    : children
);

export default ReactSelectWebComponentProvider;