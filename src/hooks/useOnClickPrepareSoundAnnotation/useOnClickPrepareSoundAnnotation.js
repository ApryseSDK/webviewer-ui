import { useEffect } from 'react'
import core from 'core';

export default function useOnClickPrepareSoundAnnotation() {
  function onAnnotationSelected(annotations, action) {
    if(action === 'selected' && annotations[0] instanceof window.Annotations.SoundAnnotation) {
      const annotationHasAudioPrepared = (annotations[0].audio.blob);
      if(!annotationHasAudioPrepared) {
        annotations[0].prepareAudioBlob();
      }
    }
  }

  useEffect(() => {
    core.addEventListener('annotationSelected', onAnnotationSelected);
    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected);
    };
  }, []);
}