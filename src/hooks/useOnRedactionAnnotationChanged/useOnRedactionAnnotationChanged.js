import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';
import { redactionTypeMap } from 'constants/redactionTypes';
import core from 'core';

export default function useOnRedactionAnnotationChanged() {
  const [redactionAnnotationsList, setRedactionAnnotationsList] = useState([]);
  const dispatch = useDispatch();
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  const [
    isNotesPanelOpen,
    isSearchPanelOpen,
  ] = useSelector(
    (state) => [
      selectors.isElementOpen(state, 'notesPanel'),
      selectors.isElementOpen(state, 'searchPanel'),
    ]
  );

  useEffect(() => {
    const setRedactionAnnotations = () => {
      const redactionAnnotations = core.getAnnotationsList().filter((annotation) => annotation instanceof window.Core.Annotations.RedactionAnnotation);
      const mediaAnnotationTypes = [
        redactionTypeMap['FULL_VIDEO_FRAME'],
        redactionTypeMap['FULL_VIDEO_FRAME_AND_AUDIO'],
        redactionTypeMap['AUDIO_REDACTION'],
      ];
      setRedactionAnnotationsList(redactionAnnotations);

      const nonMediaRedactionAnnotations = redactionAnnotations.filter((annotation) => !mediaAnnotationTypes.includes(annotation.redactionType));

      if (nonMediaRedactionAnnotations.length > 0 && !isMobile) {
        // Initially the state will be undefined, so we cast to boolean and negate it
        const isNotesPanelClosed = !isNotesPanelOpen;
        const isSearchPanelClosed = !isSearchPanelOpen;

        if (isNotesPanelClosed && isSearchPanelClosed) {
          dispatch(actions.openElement('redactionPanel'));
        }
      }
    };

    const onDocumentLoaded = () => {
      setRedactionAnnotationsList([]);
    };

    core.addEventListener('documentLoaded', onDocumentLoaded);
    core.addEventListener('annotationChanged', setRedactionAnnotations);

    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
      core.removeEventListener('annotationChanged', setRedactionAnnotations);
    };
  }, [isNotesPanelOpen, isSearchPanelOpen]);

  return redactionAnnotationsList;
}