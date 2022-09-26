import { useEffect, useState } from 'react';
import core from 'core';

export default function useOnCropAnnotationChangedOrSelected(openDocumentCropPopup) {
  const [cropAnnotation, setCropAnnotation] = useState(null);

  useEffect(() => {
    const onAnnotationChanged = (annotations, action) => {
      const annotation = annotations[0];
      if (action === 'add' && annotation.ToolName === window.Core.Tools.ToolNames['CROP'] && annotation instanceof window.Annotations.RectangleAnnotation) {
        setCropAnnotation(annotation);
        openDocumentCropPopup();
      }
      if (action === 'delete' && annotation.ToolName === window.Core.Tools.ToolNames['CROP'] && annotation instanceof window.Annotations.RectangleAnnotation) {
        setCropAnnotation(null);
      }
    };

    const onAnnotationSelected = (annotations, action) => {
      const annotation = annotations[0];
      if (action === 'selected' && annotation.ToolName === window.Core.Tools.ToolNames['CROP'] && annotation instanceof window.Annotations.RectangleAnnotation) {
        setCropAnnotation(annotation);
        openDocumentCropPopup();
      }
    };

    core.addEventListener('annotationChanged', onAnnotationChanged);
    core.addEventListener('annotationSelected', onAnnotationSelected);

    return () => {
      core.removeEventListener('annotationChanged', onAnnotationChanged);
      core.removeEventListener('annotationSelected', onAnnotationSelected);
    };
  }, []);

  return cropAnnotation;
}
