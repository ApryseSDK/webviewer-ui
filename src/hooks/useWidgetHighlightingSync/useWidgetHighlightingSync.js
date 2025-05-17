import React from 'react';
import core from 'core';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

function useWidgetHighlightingSync() {
  const isWidgetHighlightingEnabled = useSelector(selectors.isWidgetHighlightingEnabled);

  React.useEffect(() => {
    const fieldManager = core.getAnnotationManager().getFieldManager();
    const isCurrentlyEnabled = fieldManager.isWidgetHighlightingEnabled();

    if (isWidgetHighlightingEnabled !== isCurrentlyEnabled) {
      if (isWidgetHighlightingEnabled) {
        fieldManager.enableWidgetHighlighting();
      } else {
        fieldManager.disableWidgetHighlighting();
      }
    }
  }, [isWidgetHighlightingEnabled]);
}

export default useWidgetHighlightingSync;