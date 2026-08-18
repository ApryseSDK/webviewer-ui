const SIGNATURE_TOOL_NAME = 'AnnotationCreateSignature';

const getSignatureTools = (core, documentViewer, isMultiViewerMode) => {
  if (isMultiViewerMode) {
    return core.getToolsFromAllDocumentViewers(SIGNATURE_TOOL_NAME);
  }

  return [documentViewer.getTool(SIGNATURE_TOOL_NAME)];
};

export default getSignatureTools;
