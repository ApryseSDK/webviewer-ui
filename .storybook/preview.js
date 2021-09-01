import '../src/index.scss';
import '../src/components/App/App.scss';
import core from 'core'

core.getTool = function () { }

Core.setWorkerPath('./core');

import I18nDecorator from "./I18nDecorator";

window.Core.AnnotationManager.prototype.exportAnnotations = () => {};
window.Core.AnnotationManager.prototype.redrawAnnotation = () => {};

window.documentViewer = new window.Core.DocumentViewer();
window.documentViewer.doc = new window.Core.Document('dummy', 'pdf');

export const decorators = [
  I18nDecorator,
];
