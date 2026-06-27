export const getTargetTabId = (activeTab, tabs) => {
  return (activeTab || activeTab === 0) ? activeTab : tabs?.[0]?.id;
};

export const isPrimaryDocumentViewer = (documentViewerKey) => (documentViewerKey ?? 1) === 1;

export const getSecondaryDocumentKey = (documentViewerKey) => `document${documentViewerKey ?? 2}`;

export const buildTabUpdateForViewer = ({
  documentViewerKey,
  src,
  options,
  isMultiViewerMode,
}) => {
  if (isPrimaryDocumentViewer(documentViewerKey)) {
    const updateProperties = {
      src,
      isMultiViewer: isMultiViewerMode,
    };

    if (options !== undefined) {
      updateProperties.options = options;
    }

    return updateProperties;
  }

  const secondaryDocument = options === undefined ? { src } : { src, options };

  const documentProperty = getSecondaryDocumentKey(documentViewerKey);

  return {
    [documentProperty]: secondaryDocument,
  };
};
