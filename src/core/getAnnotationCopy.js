import core from 'core';

export default (annotation) => core.getDocumentViewer(1).getAnnotationManager().getAnnotationCopy(annotation);