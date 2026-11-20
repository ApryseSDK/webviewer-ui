import React from 'react';
import { useInstanceCore } from 'hooks/useCore/useCore';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

function useViewportRelativeAnnotationPositioningSync() {
  const core = useInstanceCore();
  const isViewportRelativeAnnotationPositioningEnabled = useSelector(selectors.isViewportRelativeAnnotationPositioningEnabled);

  React.useEffect(() => {
    core.getDocumentViewers().forEach((documentViewer) => {
      documentViewer.getAnnotationManager()?.setViewportRelativeAnnotationPositioning?.(isViewportRelativeAnnotationPositioningEnabled);
    });
  }, [isViewportRelativeAnnotationPositioningEnabled]);
}

export default useViewportRelativeAnnotationPositioningSync;
