import { getInstanceNode } from 'helpers/getRootNode';

export default function getCspNonce() {
  if (window.isApryseWebViewerWebComponent) {
    return getInstanceNode()?.getAttribute('cspNonce') || '';
  }

  if (window.parent !== window) {
    try {
      return window.frameElement?.dataset?.cspNonce
        || window.frameElement?.getAttribute('data-csp-nonce')
        || '';
    } catch {
      return '';
    }
  }

  return '';
}
