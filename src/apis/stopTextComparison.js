/**
 * End text comparison and delete all text comparison annotations
 * @method UI.stopTextComparison
 * @example
 WebViewer(...)
 .then(function(instance) {
    instance.UI.stopTextComparison();
  });
 */

import core from 'core';

export default () => {
  core.getDocumentViewer().stopSemanticDiff();
};