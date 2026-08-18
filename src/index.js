import getRootNode, { setRootNode } from 'helpers/getRootNode';
import {
  createInstanceI18n,
  createInstanceStoreAndPersistor,
  destroyUIInstance as destroyUIInstanceForWindow,
  initializeCanvasInstance,
  normalizeWebViewerPath,
  setupHotModuleReplacement,
  setupSpamToggleHelpers,
} from 'helpers/indexHelper';

import './index.scss';

if (window.isApryseWebViewerWebComponent) {
  normalizeWebViewerPath();
}

/**
 * Create and mount a single WebViewer UI instance.
 *
 * In **iframe mode** (the legacy default), this is called automatically at module evaluation with no arguments — it reads config from hash parameters and mounts into `document`. In **WebComponent multi-instance mode**, the host calls this once per `<apryse-webviewer>` element, passing the shadow root. Each call creates its own Redux store, React tree, DocumentViewer, and event handlers — no shared module-level singletons.
 * @ignore
 * @param {ShadowRoot} [instanceRootNode] – The shadow root to mount into. If omitted, falls back to the legacy getRootNode() scan.
 * @returns {void}
 */
function createUIInstance(instanceRootNode) {
  // If a specific root node was provided (factory path), set it so getRootNode() returns it for all code in this instance's initialization.
  if (instanceRootNode) {
    setRootNode(instanceRootNode);
  }

  normalizeWebViewerPath();

  const { store, persistor, instanceId } = createInstanceStoreAndPersistor();
  setupHotModuleReplacement(typeof module === 'undefined' ? undefined : module, store, instanceId);

  // Create a per-instance i18next so language changes in one viewer don't bleed into another. Falls back to the global singleton for single-instance / iframe mode (backward compat).
  const instanceI18n = createInstanceI18n();
  setupSpamToggleHelpers();

  if (!window.CanvasRenderingContext2D) {
    return;
  }

  initializeCanvasInstance({ store, persistor, instanceI18n, instanceRootNode, instanceId });
}

// Backward compatibility
// In iframe mode and legacy single-WC mode, auto-execute immediately (preserving existing behavior). In WC mode, the host calls createUIInstance() explicitly for each element.
if (!window.__apryseWebComponentMode) {
  createUIInstance();
}

// Export for multi-instance WC mode (called from webviewer-wc.js)
export { createUIInstance };
export { destroyUIInstance } from 'helpers/indexHelper';

// Also expose on window so that the webpack4 IIFE build (which doesn't preserve ES module exports for dynamic import()) can be called from webviewer-wc.js.
window.createUIInstance = createUIInstance;
window.destroyUIInstance = destroyUIInstanceForWindow;

window.addEventListener('hashchange', () => {
  if (!window.isApryseWebViewerWebComponent) {
    window.location.reload();
  }
});

/* The following adds a data attribute to `<html>` when user is keyboard navigating. */

function onTab(event) {
  if (event.key === 'Tab') {
    const documentElement = window.isApryseWebViewerWebComponent ? getRootNode().host : document.documentElement;
    documentElement.dataset.tabbing = 'true';
    window.removeEventListener('keydown', onTab);
    window.addEventListener('mousedown', onMouse);
  }
}

function onMouse() {
  const documentElement = window.isApryseWebViewerWebComponent ? getRootNode().host : document.documentElement;
  delete documentElement.dataset.tabbing;
  window.removeEventListener('mousedown', onMouse);
  window.addEventListener('keydown', onTab);
}

window.addEventListener('keydown', onTab);
