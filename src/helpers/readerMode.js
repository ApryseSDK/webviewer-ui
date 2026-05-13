import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import enableFeatures from 'src/apis/enableFeatures';
import disableFeatures from 'src/apis/disableFeatures';
import Feature from 'constants/feature';
import { PRIORITY_ONE } from 'constants/actionPriority';
import DataElements from 'constants/dataElement';

const features = [Feature.Download, Feature.Print, Feature.Search, Feature.NotesPanel];
const dataElements = [
  DataElements.PAN_TOOL_BUTTON,
  DataElements.SELECT_TOOL_BUTTON,
  DataElements.OUTLINE_PANEL_BUTTON,
  DataElements.BOOKMARK_PANEL_BUTTON,
  DataElements.SIGNATURE_PANEL_BUTTON,
  DataElements.SHAPES_TOOLBAR_GROUP,
  DataElements.INSERT_TOOLBAR_GROUP,
  DataElements.EDIT_TOOLBAR_GROUP,
  DataElements.EDIT_TEXT_TOOLBAR_GROUP,
  DataElements.FILL_AND_SIGN_TOOLBAR_GROUP,
  DataElements.FORMS_TOOLBAR_GROUP,
  DataElements.STICKY_TOOL_GROUP_BUTTON,
  DataElements.FREE_TEXT_TOOL_GROUP_BUTTON,
  DataElements.MARK_INSERT_TEXT_GROUP_BUTTON,
  DataElements.MARK_REPLACE_TEXT_GROUP_BUTTON,
  DataElements.SHAPE_TOOL_GROUP_BUTTON,
  DataElements.FREE_HAND_TOOL_GROUP_BUTTON,
  DataElements.FREE_HAND_HIGHLIGHT_TOOL_GROUP_BUTTON,
  DataElements.ERASER_TOOL_BUTTON,
  DataElements.FREE_HAND_TOOL_BUTTON,
  DataElements.FREE_HAND_HIGHLIGHT_TOOL_BUTTON,
  DataElements.FREE_TEXT_TOOL_BUTTON,
  DataElements.MARK_INSERT_TEXT_TOOL_BUTTON,
  DataElements.MARK_REPLACE_TEXT_TOOL_BUTTON,
  DataElements.STICKY_TOOL_BUTTON,
  DataElements.CALLOUT_TOOL_BUTTON,
  DataElements.UNDO_BUTTON,
  DataElements.REDO_BUTTON,
];

export const enterReaderMode = async (store) => {
  store.dispatch(actions.openElement(DataElements.LOADING_MODAL));

  const state = store.getState();
  const docViewer = core.getDocumentViewer();

  // Sync text annotations
  const pdfDoc = await docViewer.getDocument().getPDFDoc();
  const xfdf = await core.getAnnotationManager().exportAnnotations({
    widgets: false,
    fields: false
  });

  const PDFNet = window.Core.PDFNet;
  PDFNet.initialize().then(() => {
    const main = async () => {
      try {
        const fdfDoc = await PDFNet.FDFDoc.createFromXFDF(xfdf);
        await pdfDoc.fdfUpdate(fdfDoc);

        // Enter Reader Mode
        core.setDisplayMode('Single');
        store.dispatch(actions.setReaderMode(true));
        disableFeatures(store)(features, PRIORITY_ONE);
        store.dispatch(actions.disableElements(dataElements, PRIORITY_ONE));
        if (!selectors.isElementDisabled(state, 'toolbarGroup-Annotate')) {
          store.dispatch(actions.setToolbarGroup('toolbarGroup-Annotate'));
          store.dispatch(actions.setActiveToolGroup(''));
        } else {
          store.dispatch(actions.setToolbarGroup('toolbarGroup-View'));
        }
        docViewer.setToolMode(docViewer.getTool(window.Core.Tools.ToolNames.EDIT));
      } catch (err) {
        console.warn(err);
      } finally {
        store.dispatch(actions.closeElement(DataElements.LOADING_MODAL));
      }
    };
    PDFNet.runWithCleanup(main);
  });
};

export const exitReaderMode = async (store) => {
  const PDFNet = window.Core.PDFNet;

  // Exit Reader Mode
  store.dispatch(actions.setReaderMode(false));
  enableFeatures(store)(features, PRIORITY_ONE);
  store.dispatch(actions.enableElements(dataElements, PRIORITY_ONE));

  // Sync text annotations
  const pdfDoc = await core.getDocumentViewer().getDocument().getPDFDoc();
  const fdfDoc = await pdfDoc.fdfExtract(PDFNet.PDFDoc.ExtractFlag.e_both);
  const xfdf = await fdfDoc.saveAsXFDFAsString();
  const annotManager = core.getAnnotationManager();
  await annotManager.importAnnotations(xfdf, { replace: [window.Core.Annotations.TextMarkupAnnotation] });
};
