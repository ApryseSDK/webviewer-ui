import core from 'core';
import openFilePicker from 'helpers/openFilePicker';
import copyText from 'helpers/copyText';
import setToolModeAndGroup from 'helpers/setToolModeAndGroup';
import { zoomIn, zoomOut} from 'helpers/zoom';
import createTextAnnotationAndSelect from 'helpers/createTextAnnotationAndSelect';
import actions from 'actions';


export default dispatch => e => {
  const selectedText = core.getSelectedText();

  if (e.metaKey || e.ctrlKey) {
    if (e.shiftKey) {
      if (e.key === '+' || e.key === '=' || e.which === 187) { // (Ctrl/Cmd + Shift + +)
        e.preventDefault();
        core.rotateClockwise();
      } else if (e.key === '-' || e.which === 189) { // (Ctrl/Cmd + Shift + -)
        e.preventDefault();
        core.rotateCounterClockwise();
      }
    } else {
      if (e.key === 'c' || e.which === 67) { // (Ctrl/Cmd + C)
        if (core.getSelectedText()) {
          copyText();
          dispatch(actions.closeElement('textPopup'));
        } else if (core.getSelectedAnnotations().length > 0) {
          core.updateCopiedAnnotations();
        }
      } else if (e.key === 'v' || e.which === 86) {  // (Ctrl/Cmd + V)
        core.pasteCopiedAnnotations();
      } else if (e.key === 'o' || e.which === 79) { // (Ctrl/Cmd + O)
        e.preventDefault();
        openFilePicker();
      } else if (e.key === 'f' || e.which === 70) { // (Ctrl/Cmd + F)
        e.preventDefault();
        dispatch(actions.openElement('searchOverlay'));
      } else if (e.key === '+' || e.key === '=' || e.which === 187) { // (Ctrl/Cmd + +)
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-' || e.which === 189) { // (Ctrl/Cmd + -)
        e.preventDefault();
        zoomOut(); 
      } else if (e.key === '0' || e.which === 48) { // (Ctrl/Cmd + 0)
        e.preventDefault();
        if (window.innerWidth > 640) {
          core.fitToPage();
        } else {
          core.fitToWidth();
        }
      }
    }
  } else {
    if (e.key === 'PageUp' || e.which === 33) { // (PageUp)
      e.preventDefault();
      if (core.getCurrentPage() > 1) {
        core.setCurrentPage(core.getCurrentPage() - 1);
      }
    } else if (e.key === 'PageDown' || e.which === 34) { // (PageDown)
      e.preventDefault();
      if (core.getCurrentPage() < core.getTotalPages()) {
        core.setCurrentPage(core.getCurrentPage() + 1);
      }
    } else if (e.key === 'Escape' || e.which === 27) { // (Esc)
      e.preventDefault();
      setToolModeAndGroup(dispatch, 'AnnotationEdit', '');
      dispatch(actions.closeElements(['annotationPopup', 'textPopup', 'contextMenuPopup', 'toolStylePopup', 'annotationStylePopup', 'signatureModal', 'printModal', 'searchOverlay' ]));
    } else if (!selectedText) {
      if (document.activeElement instanceof window.HTMLInputElement || document.activeElement instanceof window.HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'p' || e.which === 80) { // (P)
        setToolModeAndGroup(dispatch, 'Pan', '');
      } else if (e.which > 64 && e.which < 91) { 
        if (e.key === 'a' || e.which === 65) {  // (A)
          setToolModeAndGroup(dispatch, 'AnnotationCreateArrow', 'shapeTools');
        } else if (e.key === 'c' || e.which === 67) { // (C)
          setToolModeAndGroup(dispatch, 'AnnotationCreateCallout', 'miscTools');
        } else if (e.key === 'f' || e.which === 70) { // (F)
          setToolModeAndGroup(dispatch, 'AnnotationCreateFreeHand', 'freeHandTools');
        } else if (e.key === 'g' || e.which === 71) { // (G)
          setToolModeAndGroup(dispatch, 'AnnotationCreateTextSquiggly', 'textTools');
        } else if (e.key === 'h' || e.which === 72) { // (H)
          setToolModeAndGroup(dispatch, 'AnnotationCreateTextHighlight', 'textTools');
        } else if (e.key === 'i' || e.which === 73) { // (I)
          setToolModeAndGroup(dispatch, 'AnnotationCreateStamp', 'miscTools');
        } else if (e.key === 'k' || e.which === 75) { // (K)
          setToolModeAndGroup(dispatch, 'AnnotationCreateTextStrikeout', 'textTools');
        } else if (e.key === 'l' || e.which === 76) { // (L)
          setToolModeAndGroup(dispatch, 'AnnotationCreateLine', 'shapeTools');
        } else if (e.key === 'n' || e.which === 78) { // (N)
          setToolModeAndGroup(dispatch, 'AnnotationCreateSticky', '');
        } else if (e.key === 'o' || e.which === 79) { // (O)
          setToolModeAndGroup(dispatch, 'AnnotationCreateEllipse', 'shapeTools');
        } else if (e.key === 'r' || e.which === 82) { // (R)
          setToolModeAndGroup(dispatch, 'AnnotationCreateRectangle', 'shapeTools');
        } else if (e.key === 's' || e.which === 83) { // (S)
          setToolModeAndGroup(dispatch, 'AnnotationCreateSignature', '');
        } else if (e.key === 't' || e.which === 84) { // (T)
          setToolModeAndGroup(dispatch, 'AnnotationCreateFreeText', '');
        } else if (e.key === 'u' || e.which === 85) { // (U)
          setToolModeAndGroup(dispatch, 'AnnotationCreateTextUnderline', 'textTools');
        }
      } 
    } else if (selectedText) {
      if (e.key === 'g' || e.which === 71) { // (G)
        createTextAnnotationAndSelect(dispatch, window.Annotations.TextSquigglyAnnotation);
      } else if (e.key === 'h' || e.which === 72) { // (H)
        createTextAnnotationAndSelect(dispatch, window.Annotations.TextHighlightAnnotation);
      } else if (e.key === 'k' || e.which === 75) { // (K)
        createTextAnnotationAndSelect(dispatch, window.Annotations.TextStrikeoutAnnotation);
      } else if (e.key === 'u' || e.which === 85) { // (U)
        createTextAnnotationAndSelect(dispatch, window.Annotations.TextUnderlineAnnotation);
      }
    } 
  }
};
