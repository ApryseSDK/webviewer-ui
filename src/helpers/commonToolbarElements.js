import core from 'core';

export const undoButton = {
  type: 'actionButton',
  style: { 'marginLeft': '0px' },
  dataElement: 'undoButton',
  title: 'action.undo',
  img: 'icon-operation-undo',
  onClick: (activeDocumentViewerKey) => {
    core.undo(activeDocumentViewerKey);
  },
  shouldPassActiveDocumentViewerKeyToOnClickHandler: true,
  isNotClickableSelector: (state) => !state.viewer.canUndo[state.viewer.activeDocumentViewerKey]
};

export const redoButton = {
  type: 'actionButton',
  dataElement: 'redoButton',
  title: 'action.redo',
  img: 'icon-operation-redo',
  onClick: (activeDocumentViewerKey) => {
    core.redo(activeDocumentViewerKey);
  },
  shouldPassActiveDocumentViewerKeyToOnClickHandler: true,
  isNotClickableSelector: (state) => !state.viewer.canRedo[state.viewer.activeDocumentViewerKey]
};
