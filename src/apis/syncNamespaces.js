import core from 'core';

/**
 * Syncs the namespaces under the Core namespace for the window, this instance, as well as others instances.
 * <br/><br/>
 * This is required for interoperability between multiple instances of WebViewer since each loaded instance ends up with different class references despite sharing the same name.
 * @method UI.syncNamespaces
 * @param {WebViewerInstance | object} namespaces The object containing the namespaces that will be used for all instances. This can be a WebViewer instance or an object with the namespaces inside.
 * @param {object} [namespaces.PDFNet] The PDFNet namespace. This is probably the most common that needs to be synced.
 * @param {object} [namespaces.Actions] The Actions namespace.
 * @param {object} [namespaces.Annotations] The Annotations namespace.
 * @param {object} [namespaces.Math] The Math namespace.
 * @param {object} [namespaces.Tools] The Tools namespace.
 * @param {...WebViewerInstance} otherInstances Other instances that will share the same namespaces.
 * @example
// Loaded PDFNet directly
const Core = window.Core;
const PDFNet = Core.PDFNet;
Core.setWorkerPath('../../../lib/core');
Core.enableFullPDF();
...
WebViewer(...)
  .then(function(instance) {
    // Force this instance to use the loaded PDFNet instead of the one loaded specific to this instance
    instance.UI.syncNamespaces({ PDFNet });
    // instance.UI.syncNamespaces({ PDFNet }, instance2, instance3);  // Alternative; instance, instance2, and instance3 will share the same PDFNet namespace.
    ...
  });
 */

export default (namespaces, ...otherInstances) => {
  const instances = [window.instance, ...otherInstances];
  if (!namespaces) {
    namespaces = window.instance;
  }
  const { PDFNet, Actions, Annotations, Math, Tools } = namespaces;
  instances.forEach(instance => {
    if (instance && instance !== namespaces) {
      core.syncNamespaces(namespaces);
      if (PDFNet) {
        instance.Core.PDFNet = PDFNet;
        // Remove in 9.0
        instance.CoreControls.PDFNet = instance.PDFNet = PDFNet;
      }
      if (Actions) {
        instance.Core.Actions = Actions;
        // Remove in 9.0
        instance.CoreControls.Actions = instance.Actions = Actions;
      }
      if (Annotations) {
        instance.Core.Annotations = Annotations;
        // Remove in 9.0
        instance.CoreControls.Annotations = instance.Annotations = Annotations;
      }
      if (Math) {
        instance.Core.Math = Math;
        // Remove in 9.0
        instance.CoreControls.Math = instance.Math = Math;
      }
      if (Tools) {
        instance.Core.Tools = Tools;
        // Remove in 9.0
        instance.CoreControls.Tools = instance.Tools = Tools;
      }
    }
  });
};
