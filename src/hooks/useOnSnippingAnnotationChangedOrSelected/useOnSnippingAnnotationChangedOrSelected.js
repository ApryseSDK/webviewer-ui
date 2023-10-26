import { useEffect, useState } from 'react';
import core from 'core';

export default function useOnCropAnnotationChangedOrSelected(openSnippingPopup) {
  const [snippingAnnotation, setSnippingAnnotation] = useState(null);

  useEffect(() => {
    const onAnnotationChanged = (annotations, action) => {
      const annotation = annotations[0];
      if (action === 'add' && annotation.ToolName === window.Core.Tools.ToolNames['SNIPPING'] && annotation instanceof window.Core.Annotations.RectangleAnnotation) {
        setSnippingAnnotation(annotation);
        openSnippingPopup();
      }
      if (action === 'delete' && annotation.ToolName === window.Core.Tools.ToolNames['SNIPPING'] && annotation instanceof window.Core.Annotations.RectangleAnnotation) {
        setSnippingAnnotation(null);
      }
    };

    const onAnnotationSelected = (annotations, action) => {
      const annotation = annotations[0];
      if (action === 'selected' && annotation.ToolName === window.Core.Tools.ToolNames['SNIPPING'] && annotation instanceof window.Core.Annotations.RectangleAnnotation) {
        setSnippingAnnotation(annotation);
        openSnippingPopup();
      }
    };

    core.addEventListener('annotationChanged', onAnnotationChanged);
    core.addEventListener('annotationSelected', onAnnotationSelected);

    return () => {
      core.removeEventListener('annotationChanged', onAnnotationChanged);
      core.removeEventListener('annotationSelected', onAnnotationSelected);
    };
  }, []);

  return snippingAnnotation;
}
