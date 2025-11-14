/* eslint-disable no-unused-vars */
import core from 'core';
import selectors from 'selectors';
import actions from 'actions';
import defaultTool from 'constants/defaultTool';
import { ITEM_RENDER_PREFIXES } from 'constants/customizationVariables';

export default (documentViewerKey, store, dispatch) => (signatureAnnotation) => {
  core.setToolMode(defaultTool);
  const signatureToolArray = core.getToolsFromAllDocumentViewers('AnnotationCreateSignature');
  signatureToolArray.forEach((tool) => {
    tool.hidePreview();
    tool.annot = null;
  });

  const signatureListPanelInFlyout = selectors.getIsPanelInFlyout(store.getState(), ITEM_RENDER_PREFIXES.SIGNATURE_LIST_PANEL);
  if (signatureListPanelInFlyout) {
    dispatch(actions.closeElement(signatureListPanelInFlyout.dataElement));
  }
  // This had not been working and was fixed when the signature list panel was added
  // however it now causes issues with the annotation popup being out of place. Once that is
  // fixed this should be re-enabled
  // core.selectAnnotation(signatureAnnotation, documentViewerKey);
};
