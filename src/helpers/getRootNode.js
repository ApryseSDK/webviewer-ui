let rootNode;

function findNestedWebComponents(tagName, root = document) {
  const elements = [];

  // Check direct children
  root.querySelectorAll(tagName).forEach((el) => elements.push(el));

  // Check shadow DOMs
  root.querySelectorAll('*').forEach((el) => {
    if (el.shadowRoot) {
      elements.push(...findNestedWebComponents(tagName, el.shadowRoot));
    }
  });

  return elements;
}

/**
 * Explicitly set the root node for the current UI instance.
 *
 * @ignore
 * @param {ShadowRoot|Document} node
 */
export const setRootNode = (node) => {
  rootNode = node;
  if (node && node !== document) {
    node.mounted = true;
  }
};

/**
 * Reset the rootNode cache.
 *
 * @ignore
 */
export const resetRootNode = () => {
  rootNode = undefined;
};

const getRootNode = () => {
  if (!window.isApryseWebViewerWebComponent) {
    return document;
  }
  if (rootNode) {
    return rootNode;
  }

  let elementList;
  elementList = document.getElementsByTagName('apryse-webviewer');
  if (elementList.length === 0) {
    elementList = findNestedWebComponents('apryse-webviewer');
  }

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
  return undefined;
};

export const getInstanceID = () => {
  const root = getRootNode();
  const host = root?.host;
  return host ? host.getAttribute('id') || 'default' : 'default';
};

export const getInstanceNode = () => {
  if (!window.isApryseWebViewerWebComponent) {
    return window;
  }
  if (rootNode) {
    return rootNode.host;
  }
  const root = getRootNode();
  return root?.host || null;
};

export const getWebViewerRect = () => {
  if (!window.isApryseWebViewerWebComponent) {
    return window.document.documentElement.getBoundingClientRect();
  }
  return getInstanceNode().getBoundingClientRect();
};

export default getRootNode;
