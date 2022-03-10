import React, { useState, useEffect } from 'react';
import core from 'core';


const RedactionPanelContext = React.createContext();

const RedactionPanelProvider = ({ children }) => {
  const [selectedRedactionItemId, setSelectedRedactionItemId] = useState(null);

  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      if (action === 'selected') {
        const redactionAnnotations = annotations.filter(annotation => annotation.Subject === 'Redact');
        // If multiple ones selected, we only use the first one
        const selectedAnnotationId = redactionAnnotations.length > 0 ? redactionAnnotations[0].Id : null;
        setSelectedRedactionItemId(selectedAnnotationId);
      } else {
        setSelectedRedactionItemId(null);
      }
    };

    core.addEventListener('annotationSelected', onAnnotationSelected);

    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected);
    };
  }, []);

  const value = { selectedRedactionItemId, setSelectedRedactionItemId };

  return <RedactionPanelContext.Provider value={value}>{children}</RedactionPanelContext.Provider>;
};

export { RedactionPanelProvider, RedactionPanelContext };

