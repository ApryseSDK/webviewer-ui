let rootNode;

const getRootNode = () => {
  if (!window.isApryseWebViewerWebComponent) {
    return document;
  }
  if (rootNode) {
    return rootNode;
  }
  const elementList = document.getElementsByTagName('apryse-webviewer');
  if (elementList?.length) {
    for (const element of elementList) {
      const foundNode = element.shadowRoot;
      if (foundNode && !foundNode.mounted) {
        foundNode.mounted = true;
        rootNode = foundNode;
        return rootNode;
      }
    }
  }
  console.error('Cannot find root node');
};

export const getInstanceID = () => {
  const host = getRootNode().host;
  return host ? host.getAttribute('id') : 'default';
};

export const getInstanceNode = () => {
  if (!window.isApryseWebViewerWebComponent) {
    return window;
  }
  return rootNode ? rootNode.host : getRootNode().host;
};

export default getRootNode;
