import React from 'react';
import core from 'core';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

function useViewportRelativeAnnotationPositioningSync() {
  const isViewportRelativeAnnotationPositioningEnabled = useSelector(selectors.isViewportRelativeAnnotationPositioningEnabled);

  React.useEffect(() => {
    core.getDocumentViewers().forEach((documentViewer) => {
      documentViewer.getAnnotationManager()?.setViewportRelativeAnnotationPositioning?.(isViewportRelativeAnnotationPositioningEnabled);
    });
  }, [isViewportRelativeAnnotationPositioningEnabled]);
}

export default useViewportRelativeAnnotationPositioningSync;
