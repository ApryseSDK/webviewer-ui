import hotkeys from 'hotkeys-js';

import core from 'core';
import openFilePicker from 'helpers/openFilePicker';
import copyText from 'helpers/copyText';
import setToolModeAndGroup from 'helpers/setToolModeAndGroup';
import { zoomIn, zoomOut } from 'helpers/zoom';
import print from 'helpers/print';
import createTextAnnotationAndSelect from 'helpers/createTextAnnotationAndSelect';
import { isMobile } from 'helpers/device';
import isFocusingElement from 'helpers/isFocusingElement';
import actions from 'actions';
import selectors from 'selectors';

export default ({ dispatch, getState }) => () => {
  // still allow hotkeys when focusing a textarea or an input
  hotkeys.filter = () => true;

  hotkeys('ctrl+shift+=, command+shift+=', e => {
    e.preventDefault();
    core.rotateClockwise();
  });

  hotkeys('ctrl+shift+-, command+shift+-', e => {
    e.preventDefault();
    core.rotateCounterClockwise();
  });

  hotkeys('ctrl+c, command+c', () => {
    if (core.getSelectedText()) {
      copyText();
      dispatch(actions.closeElement('textPopup'));
    } else if (core.getSelectedAnnotations().length) {
      core.updateCopiedAnnotations();
    }
  });

  hotkeys('ctrl+v, command+v', e => {
    if (!isFocusingElement()) {
      e.preventDefault();
      core.pasteCopiedAnnotations();
    }
  });

  hotkeys('ctrl+o, command+o', e => {
    e.preventDefault();
    openFilePicker();
  });

  hotkeys('ctrl+f, command+f', e => {
    e.preventDefault();
    dispatch(actions.openElement('searchOverlay'));
  });

  hotkeys('ctrl+=, command+=', e => {
    e.preventDefault();
    zoomIn();
  });

  hotkeys('ctrl+-, command+-', e => {
    e.preventDefault();
    zoomOut();
  });

  hotkeys('ctrl+0, command+0', e => {
    e.preventDefault();

    if (isMobile) {
      core.fitToWidth();
    } else {
      core.fitToPage();
    }
  });

  hotkeys('ctrl+p, command+p', e => {
    e.preventDefault();

    print(dispatch, selectors.isEmbedPrintSupported(getState()));
  });

  hotkeys('pageup', e => {
    e.preventDefault();

    const currPageNumber = core.getCurrentPage();
    if (currPageNumber > 1) {
      core.setCurrentPage(currPageNumber - 1);
    }
  });

  hotkeys('pagedown', e => {
    e.preventDefault();

    const currPageNumber = core.getCurrentPage();
    if (currPageNumber < core.getTotalPages()) {
      core.setCurrentPage(currPageNumber + 1);
    }
  });

  hotkeys('escape', e => {
    e.preventDefault();
    setToolModeAndGroup(dispatch, 'AnnotationEdit', '');
    dispatch(
      actions.closeElements([
        'annotationPopup',
        'textPopup',
        'contextMenuPopup',
        'toolStylePopup',
        'annotationStylePopup',
        'signatureModal',
        'printModal',
        'searchOverlay',
      ]),
    );
  });

  addToolHotKeys('p', () => {
    setToolModeAndGroup(dispatch, 'Pan', '');
  });

  addToolHotKeys('a', () => {
    setToolModeAndGroup(dispatch, 'AnnotationCreateArrow', 'shapeTools');
  });

  addToolHotKeys('c', () => {
    setToolModeAndGroup(dispatch, 'AnnotationCreateCallout', 'miscTools');
  });

  addToolHotKeys('e', () => {
    setToolModeAndGroup(dispatch, 'AnnotationEraserTool', '');
  });

  addToolHotKeys('f', () => {
    setToolModeAndGroup(dispatch, 'AnnotationCreateFreeHand', 'freeHandTools');
  });

  addToolHotKeys('i', () => {
    setToolModeAndGroup(dispatch, 'AnnotationCreateStamp', 'miscTools');
  });

  addToolHotKeys('l', () => {
    setToolModeAndGroup(dispatch, 'AnnotationCreateLine', 'shapeTools');
  });

  addToolHotKeys('n', () => {
    setToolModeAndGroup(dispatch, 'AnnotationCreateSticky', '');
  });

  addToolHotKeys('o', () => {
    setToolModeAndGroup(dispatch, 'AnnotationCreateEllipse', 'shapeTools');
  });

  addToolHotKeys('r', () => {
    setToolModeAndGroup(dispatch, 'AnnotationCreateRectangle', 'shapeTools');
  });

  addToolHotKeys('t', () => {
    setToolModeAndGroup(dispatch, 'AnnotationCreateFreeText', '');
  });

  addToolHotKeys('s', () => {
    const sigToolButton = document.querySelector(
      '[data-element="signatureToolButton"]',
    );

    sigToolButton?.click();
  });

  addToolHotKeys('g', selectedText => {
    if (selectedText) {
      createTextAnnotationAndSelect(
        dispatch,
        window.Annotations.TextSquigglyAnnotation,
      );
    } else {
      setToolModeAndGroup(
        dispatch,
        'AnnotationCreateTextSquiggly',
        'textTools',
      );
    }
  });

  addToolHotKeys('h', selectedText => {
    if (selectedText) {
      createTextAnnotationAndSelect(
        dispatch,
        window.Annotations.TextHighlightAnnotation,
      );
    } else {
      setToolModeAndGroup(
        dispatch,
        'AnnotationCreateTextHighlight',
        'textTools',
      );
    }
  });

  addToolHotKeys('k', selectedText => {
    if (selectedText) {
      createTextAnnotationAndSelect(
        dispatch,
        window.Annotations.TextStrikeoutAnnotation,
      );
    } else {
      setToolModeAndGroup(
        dispatch,
        'AnnotationCreateTextStrikeout',
        'textTools',
      );
    }
  });

  addToolHotKeys('u', selectedText => {
    if (selectedText) {
      createTextAnnotationAndSelect(
        dispatch,
        window.Annotations.TextUnderlineAnnotation,
      );
    } else {
      setToolModeAndGroup(
        dispatch,
        'AnnotationCreateTextUnderline',
        'textTools',
      );
    }
  });
};

const addToolHotKeys = (key, cb) => {
  hotkeys(key, (...args) => {
    if (!isFocusingElement()) {
      cb(core.getSelectedText(), ...args);
    }
  });
};
