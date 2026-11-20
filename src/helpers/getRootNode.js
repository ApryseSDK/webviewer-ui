import { createInstanceScopedState } from 'core/documentViewers';

let rootNode;
// The module-level `rootNode` is whichever instance called setRootNode last; prefer the root registered for the ambient instance.
const instanceRootNodes = createInstanceScopedState(() => ({ node: undefined }));

let startingRootNode;

const getKnownRootNode = (instanceId) => startingRootNode || instanceRootNodes.get(instanceId).node || rootNode;

/**
 * Runs `fn` with `node` as the root for every lookup, for the synchronous startup of a new instance.
 * @ignore
 */
export const runWithStartingRootNode = (node, fn) => {
  const previous = startingRootNode;
  startingRootNode = node;
  try {
    return fn();
  } finally {
    startingRootNode = previous;
  }
};

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

/**
 * Records the root node owned by `instanceId`, so getRootNode() resolves that instance's shadow root while it is ambient.
 * @ignore
 */
export const setInstanceRootNode = (instanceId, node) => {
  instanceRootNodes.get(instanceId).node = node;
};

/**
 * Clear the rootNode cache if it still points at the given node, so a destroyed instance is not retained.
 *
 * @ignore
 * @param {ShadowRoot|Document} node
 */
export const releaseRootNode = (node) => {
  if (node && rootNode === node) {
    rootNode = undefined;
  }
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

/**
 * Whether a DOM event originated inside the given element, including from within nested shadow roots.
 * In web component mode a window or app-root listener sees `event.target` retargeted to the shadow host,
 * so `element.contains(event.target)` misses events from inside the shadow tree; the composed path does not.
 *
 * @ignore
 * @param {Event} event
 * @param {Element} [element]
 * @returns {boolean}
 */
export const isEventWithinElement = (event, element) => event.composedPath().includes(element);

const getRootNode = (instanceId) => {
  if (!window.isApryseWebViewerWebComponent) {
    return document;
  }
  const knownRootNode = getKnownRootNode(instanceId);
  if (knownRootNode) {
    return knownRootNode;
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
        setRootNode(foundNode);
        return foundNode;
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
  const knownRootNode = getKnownRootNode();
  if (knownRootNode) {
    return knownRootNode.host;
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

/**
 * Get the root node that holds the Spreadsheet Editor grid.
 *
 * In web component mode the editor renders inside its own nested shadow root, which a query from the
 * WebViewer root cannot reach. Otherwise the WebViewer root is returned.
 *
 * @ignore
 * @returns {Document|ShadowRoot|undefined}
 */
export const getSpreadsheetEditorRoot = () => {
  const root = getRootNode();
  return root?.querySelector('ltleadsheet-element')?.shadowRoot ?? root;
};

export default getRootNode;
