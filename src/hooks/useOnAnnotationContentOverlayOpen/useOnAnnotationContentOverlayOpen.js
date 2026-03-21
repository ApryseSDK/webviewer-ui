import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import useCore from '../useCore';
import DataElements from 'constants/dataElement';

export default function useOnAnnotationContentOverlayOpen() {
  const { core } = useCore();
  // Clients have the option to customize how the tooltip is rendered by passing a handler
  const customHandler = useSelector((state) => selectors.getAnnotationContentOverlayHandler(state));
  const dispatch = useDispatch();
  const [annotation, setAnnotation] = useState(null);
  const [clientXY, setClientXY] = useState({ clientX: 0, clientY: 0 });
  const isUsingCustomHandler = customHandler !== null;
  const isOverlayOpenRef = useRef(false);

  useEffect(() => {
    const resetOverlay = () => {
      setAnnotation(null);
      setClientXY((prev) => (
        prev.clientX === 0 && prev.clientY === 0
          ? prev
          : { clientX: 0, clientY: 0 }
      ));
      if (isOverlayOpenRef.current) {
        isOverlayOpenRef.current = false;
        dispatch(actions.closeElement(DataElements.ANNOTATION_CONTENT_OVERLAY));
      }
    };

    // Clear stale overlay state when switching active viewer/core instance.
    resetOverlay();

    const onMouseHover = (e) => {
      if (e.buttons !== 0) {
        return;
      }

      const viewElement = core.getViewerElement();
      if (!viewElement || !viewElement.contains(e.target)) {
        resetOverlay();
        return;
      }

      let annotation = core.getAnnotationManager().getAnnotationByMouseEvent(e);
      if (!annotation) {
        resetOverlay();
        return;
      }

      // if hovered annot is grouped, pick the "primary" annot to match Adobe's behavior
      const groupedAnnots = core.getAnnotationManager().getGroupAnnotations(annotation);
      const ungroupedAnnots = groupedAnnots.filter((annot) => !annot.isGrouped());
      annotation = ungroupedAnnots.length > 0 ? ungroupedAnnots[0] : annotation;

      const isFreeTextAnnotation = annotation instanceof window.Core.Annotations.FreeTextAnnotation;
      if (!isUsingCustomHandler && isFreeTextAnnotation) {
        resetOverlay();
        return;
      }

      setClientXY({ clientX: e.clientX, clientY: e.clientY });
      setAnnotation(annotation);
      if (!isOverlayOpenRef.current) {
        isOverlayOpenRef.current = true;
        dispatch(actions.openElement(DataElements.ANNOTATION_CONTENT_OVERLAY));
      }
    };

    core.addEventListener('mouseMove', onMouseHover);
    return () => {
      core.removeEventListener('mouseMove', onMouseHover);
      if (isOverlayOpenRef.current) {
        isOverlayOpenRef.current = false;
        dispatch(actions.closeElement(DataElements.ANNOTATION_CONTENT_OVERLAY));
      }
    };
  }, [isUsingCustomHandler, core, dispatch]);

  return { annotation, clientXY };
}
