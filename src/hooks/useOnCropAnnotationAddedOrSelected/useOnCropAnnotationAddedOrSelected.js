import { useEffect, useState } from 'react'
import core from 'core';

export default function useOnCropAnnotationAddedOrSelected(openDocumentCropPopup) {
  const [cropAnnotation, setCropAnnotation] = useState(null);

  useEffect(() => {
    const onAnnotationChanged = (annotations, action) => {
      const annotation = annotations[0];
      if(action === 'add' && annotation.Subject === 'Rectangle' && annotation.ToolName === window.Core.Tools.ToolNames['CROP']) {
        setCropAnnotation(annotation);
        openDocumentCropPopup();
      }
      if(action === 'delete' && annotation.Subject === 'Rectangle' && annotation.ToolName === window.Core.Tools.ToolNames['CROP']) {
        setCropAnnotation(null);
      }
    };

    const onAnnotationSelected = (annotations, action) => {
      const annotation = annotations[0];
      if(action === 'selected' && annotation.Subject === 'Rectangle' && annotation.ToolName === window.Core.Tools.ToolNames['CROP']) {
        setCropAnnotation(annotation);
        openDocumentCropPopup();
      }
    }

    core.addEventListener('annotationChanged', onAnnotationChanged);
    core.addEventListener('annotationSelected', onAnnotationSelected);

    return () => {
      core.removeEventListener('annotationChanged', onAnnotationChanged);
      core.removeEventListener('annotationSelected', onAnnotationSelected);
    };
  }, []);

  return cropAnnotation;
}