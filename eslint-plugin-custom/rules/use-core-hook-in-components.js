module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require using useCore hook instead of direct core import in React components',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      useCoreHook: 'Use the useCore hook instead of importing core directly in React components. Import from "hooks/useCore" to automatically inject the viewer key.',
      useCoreHookDocumentViewer: 'Use the useCore hook instead of accessing window.Core.documentViewer/globalThis.Core.documentViewer. Import from "hooks/useCore" to automatically inject the viewer key.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();
    
    if (/(\.test\.js|\.spec\.js|\.stories\.js)$/.test(filename)) {
      return {};
    }

    let hasCoreImport = false;
    let coreImportNode = null;
    let windowCoreDocumentViewerNode = null;
    let isReactComponent = false;

    const isWindowGlobal = (node) => node.type === 'Identifier' && (node.name === 'window' || node.name === 'globalThis');

    const isWindowCoreDocumentViewer = (node) => (
      node
      && node.type === 'MemberExpression'
      && !node.computed
      && node.property?.type === 'Identifier'
      && node.property.name === 'documentViewer'
      && node.object
      && node.object.type === 'MemberExpression'
      && !node.object.computed
      && node.object.property?.type === 'Identifier'
      && node.object.property.name === 'Core'
      && isWindowGlobal(node.object.object)
    );

    function checkIfReactComponent(node, parent) {
      if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
        isReactComponent = true;
      }

      if (node.type === 'FunctionDeclaration' && node.id?.name && /^[A-Z]/.test(node.id.name)) {
        isReactComponent = true;
      }

      if (node.type === 'ArrowFunctionExpression'
        && parent?.type === 'VariableDeclarator'
        && parent.id?.type === 'Identifier'
        && /^[A-Z]/.test(parent.id.name)) {
        isReactComponent = true;
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'core') {
          hasCoreImport = true;
          coreImportNode = node;
        }
      },

      JSXElement() {
        isReactComponent = true;
      },

      JSXFragment() {
        isReactComponent = true;
      },

      CallExpression(node) {
        checkIfReactComponent(node, node.parent);
      },

      FunctionDeclaration(node) {
        checkIfReactComponent(node, node.parent);
      },

      ArrowFunctionExpression(node) {
        checkIfReactComponent(node, node.parent);
      },

      MemberExpression(node) {
        if (isWindowCoreDocumentViewer(node) || (node.object && isWindowCoreDocumentViewer(node.object))) {
          windowCoreDocumentViewerNode = node;
        }
      },

      'Program:exit'() {
        if (hasCoreImport && isReactComponent && coreImportNode) {
          context.report({
            node: coreImportNode,
            messageId: 'useCoreHook',
          });
        }

        if (isReactComponent && windowCoreDocumentViewerNode) {
          context.report({
            node: windowCoreDocumentViewerNode,
            messageId: 'useCoreHookDocumentViewer',
          });
        }
      },
    };
  },
};
