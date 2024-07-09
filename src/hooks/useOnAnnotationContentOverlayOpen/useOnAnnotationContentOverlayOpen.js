import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import DataElements from 'constants/dataElement';

export default function useOnAnnotationContentOverlayOpen() {
  // Clients have the option to customize how the tooltip is rendered by passing a handler
  const customHandler = useSelector((state) => selectors.getAnnotationContentOverlayHandler(state));

  const dispatch = useDispatch();
  const [annotation, setAnnotation] = useState(null);
  const [clientXY, setClientXY] = useState({ clientX: 0, clientY: 0 });
  const isUsingCustomHandler = customHandler !== null;

  useEffect(() => {
    const viewElement = core.getViewerElement();

    const onMouseHover = (e) => {
      if (e.buttons !== 0) {
        return;
      }
      let annotation = core.getAnnotationManager().getAnnotationByMouseEvent(e);

      if (annotation && viewElement.contains(e.target)) {
        // if hovered annot is grouped, pick the "primary" annot to match Adobe's behavior
        const groupedAnnots = core.getAnnotationManager().getGroupAnnotations(annotation);
        const ungroupedAnnots = groupedAnnots.filter((annot) => !annot.isGrouped());
        annotation = ungroupedAnnots.length > 0 ? ungroupedAnnots[0] : annotation;

        const isFreeTextAnnotation = annotation instanceof window.Core.Annotations.FreeTextAnnotation;
        if (isUsingCustomHandler || !isFreeTextAnnotation) {
          setClientXY({ clientX: e.clientX, clientY: e.clientY });
          setAnnotation(annotation);
          dispatch(actions.openElement(DataElements.ANNOTATION_CONTENT_OVERLAY));
        }
      } else {
        setAnnotation(null);
        dispatch(actions.closeElement(DataElements.ANNOTATION_CONTENT_OVERLAY));
      }
    };

    core.addEventListener('mouseMove', onMouseHover);
    return () => core.removeEventListener('mouseMove', onMouseHover);
  }, [annotation, isUsingCustomHandler]);

  return { annotation, clientXY };
}