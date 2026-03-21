import React, { useState, useEffect } from 'react';
import useCore from 'hooks/useCore';


const RedactionPanelContext = React.createContext();

const RedactionPanelProvider = ({ children }) => {
  const { core } = useCore();
  const [selectedRedactionItemId, setSelectedRedactionItemId] = useState(null);
  const [isRedactionSearchActive, setIsRedactionSearchActive] = useState(false);
  const [activeSearchResultIndex, setActiveSearchResultIndex] = useState(-1);

  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      if (action === 'selected') {
        const redactionAnnotations = annotations.filter((annotation) => annotation.Subject === 'Redact');
        // If multiple ones selected, we only use the first one
        const selectedAnnotationId = redactionAnnotations.length > 0 ? redactionAnnotations[0].Id : null;
        setSelectedRedactionItemId(selectedAnnotationId);
      } else {
        setSelectedRedactionItemId(null);
      }
    };

    const activeSearchResultChanged = (newActiveSearchResult) => {
      if (!newActiveSearchResult) {
        return;
      }
      const coreSearchResults = core.getPageSearchResults() || [];
      const newActiveSearchResultIndex = coreSearchResults.findIndex((searchResult) => {
        return core.isSearchResultEqual(searchResult, newActiveSearchResult);
      });
      setActiveSearchResultIndex(newActiveSearchResultIndex);
    };

    core.addEventListener('annotationSelected', onAnnotationSelected);
    core.addEventListener('activeSearchResultChanged', activeSearchResultChanged);

    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected);
      core.removeEventListener('activeSearchResultChanged', activeSearchResultChanged);
    };
  }, [core]);

  const value = {
    selectedRedactionItemId,
    setSelectedRedactionItemId,
    isRedactionSearchActive,
    setIsRedactionSearchActive,
    activeSearchResultIndex
  };

  return <RedactionPanelContext.Provider value={value}>{children}</RedactionPanelContext.Provider>;
};

export { RedactionPanelProvider, RedactionPanelContext };
