import core from 'core';

export const undoButton = {
  type: 'actionButton',
  style: { 'marginLeft': '0px' },
  dataElement: 'undoButton',
  title: 'action.undo',
  img: 'icon-operation-undo',
  onClick: () => {
    core.undo();
  },
  isNotClickableSelector: state => !state.viewer.canUndo
};

export const redoButton = {
  type: 'actionButton',
  dataElement: 'redoButton',
  title: 'action.redo',
  img: 'icon-operation-redo',
  onClick: () => {
    core.redo();
  },
  isNotClickableSelector: state => !state.viewer.canRedo
};
