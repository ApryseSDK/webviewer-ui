import core from 'core';
import selectors from 'selectors';

const setViewportRelativeAnnotationPositioning = (state, documentViewerKey) => {
  core.getDocumentViewer(documentViewerKey)?.getAnnotationManager()?.setViewportRelativeAnnotationPositioning?.(
    selectors.isViewportRelativeAnnotationPositioningEnabled(state)
  );
};

export default setViewportRelativeAnnotationPositioning;