import { useEffect, useState } from 'react';
import { useInstanceCore } from 'hooks/useCore/useCore';

export default function useOnCropAnnotationAdded(openDocumentCropPopup) {
  const core = useInstanceCore();
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