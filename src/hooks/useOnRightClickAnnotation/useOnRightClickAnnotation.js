import { useState, useCallback } from 'react';
import { useInstanceCore } from 'hooks/useCore/useCore';
import useOnRightClick from 'hooks/useOnRightClick';

export default () => {
  const core = useInstanceCore();
  const [rightClickedAnnotation, setRightClickedAnnotation] = useState(null);

  useOnRightClick(
    useCallback((e) => {
      const annotUnderMouse = core.getAnnotationByMouseEvent(e);
      if (annotUnderMouse && annotUnderMouse.ToolName !== window.Core.Tools.ToolNames.CROP) {
        if (annotUnderMouse !== rightClickedAnnotation) {
          setRightClickedAnnotation(annotUnderMouse);
        }
      }
    }, [rightClickedAnnotation])
  );

  return { rightClickedAnnotation, setRightClickedAnnotation };
};
