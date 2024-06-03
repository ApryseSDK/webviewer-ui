import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import DataElements from 'constants/dataElement';

export default function useOnLinkAnnotationPopupOpen() {
  const dispatch = useDispatch();
  const [annotation, setAnnotation] = useState(null);

  const activeDocumentViewerKey = useSelector((state) => selectors.getActiveDocumentViewerKey(state));

  const closePopup = () => {
    dispatch(actions.closeElement(DataElements.ANNOTATION_ALIGNMENT_POPUP));
    setAnnotation(null);
  };

  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      if (annotations.length === 0) {
        return;
      }

      if (action === 'selected') {
        setAnnotation(annotations[0]);
      }

      const actionOnOtherAnnotation = annotation && !annotations.includes(annotation);
      if (action === 'deselected' && !actionOnOtherAnnotation) {
        closePopup();
      }
    };

    core.addEventListener('annotationSelected', onAnnotationSelected, null, activeDocumentViewerKey);
    core.addEventListener('documentUnloaded', closePopup, null, activeDocumentViewerKey);

    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected, null, activeDocumentViewerKey);
      core.removeEventListener('documentUnloaded', closePopup, null, activeDocumentViewerKey);
    };
  }, [annotation, activeDocumentViewerKey]);

  return { annotation };
}
