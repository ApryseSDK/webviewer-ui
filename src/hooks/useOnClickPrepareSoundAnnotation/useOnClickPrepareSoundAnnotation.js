import { useEffect } from 'react';
import { useInstanceCore } from 'hooks/useCore/useCore';

export default function useOnClickPrepareSoundAnnotation() {
  const core = useInstanceCore();
  function onAnnotationSelected(annotations, action) {
    if (action === 'selected' && annotations[0] instanceof window.Core.Annotations.SoundAnnotation) {
      const annotationHasAudioPrepared = (annotations[0].audio.blob);
      if (!annotationHasAudioPrepared) {
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