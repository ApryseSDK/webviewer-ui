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

export const getShadowRootFromNode = (node) => {
  if (!node) {
    return null;
  }

  if (node.shadowRoot) {
    return node.shadowRoot;
  }

  if (typeof node.getRootNode === 'function') {
    const root = node.getRootNode();
    return root?.host ? root : null;
  }

  return null;
};

export const getInstanceRootFromEvent = (event) => {
  const eventPath = typeof event?.composedPath === 'function' ? event.composedPath() : [];
  const candidateNodes = [
    ...eventPath,
    event?.target,
    event?.currentTarget?.activeElement,
  ];

  for (const node of candidateNodes) {
    const root = getShadowRootFromNode(node);
    if (root) {
      return root;
    }
  }

  return null;
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

/**
 * Get the bounding rect of the WebViewer instance that contains the given element.
 *
 * When the element lives inside a shadow root, the rect of that shadow root's host
 * is returned so resizing works correctly with multiple WebViewer instances.
 * Otherwise it falls back to the global WebViewer rect.
 *
 * @ignore
 * @param {Element} element to get the WebViewer rect for
 * @returns {DOMRect} the bounding rect of the WebViewer instance that contains the element
 */
export const getInstanceRect = (element) => {
  const root = element?.getRootNode?.();
  const host = root?.host;
  return host ? host.getBoundingClientRect() : getWebViewerRect();
};

export default getRootNode;
