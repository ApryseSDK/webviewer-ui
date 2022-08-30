import { useEffect, useState } from 'react';
import core from 'core';

export default function useOnCropAnnotationAdded(openDocumentCropPopup) {
  const [cropAnnotation, setCropAnnotation] = useState(null);

  useEffect(() => {
    const onAnnotationChanged = (annotations, action) => {
      const annotation = annotations[0];
      if (action === 'add' && annotation.Subject === 'Rectangle' && annotation.ToolName === 'CropPage') {
        setCropAnnotation(annotation);
        openDocumentCropPopup();
      }
    };

    core.addEventListener('annotationChanged', onAnnotationChanged);

    return () => {
      core.removeEventListener('annotationChanged', onAnnotationChanged);
    };
  }, []);

  return cropAnnotation;
}