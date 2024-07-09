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
