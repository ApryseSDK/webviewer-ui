import getRootNode from './getRootNode';

const dropTargets = {
  'toolButton': [
    'tools-header',
    'groupedLeftHeaderButtons',
    'groupedRightHeaderStartButtons',
    'groupedRightHeaderEndButtons',
  ],
  'divider': [
    'tools-header',
    'groupedLeftHeaderButtons',
    'groupedRightHeaderStartButtons',
    'groupedRightHeaderEndButtons',
  ],
  'groupedItems': [
    'tools-header',
    'groupedLeftHeaderButtons',
    'groupedRightHeaderStartButtons',
    'groupedRightHeaderEndButtons',
  ],
  'presetButton': [
    'tools-header',
    'groupedLeftHeaderButtons',
  ],
  'toggleButton': [
    'tools-header',
    'groupedLeftHeaderButtons', // FYI, we block toggle buttons (search, notes) from being dragged over the ribbons.
    'groupedRightHeaderStartButtons',
    'groupedRightHeaderEndButtons',
  ],
  'ribbonItem': [
    'default-ribbon-group'
  ],
  'panel' : [
    'left-panel-dropzone',
    'right-panel-dropzone',
  ],
  'baseToolButton': [
    'tools-header',
    'groupedLeftHeaderButtons',
    'groupedRightHeaderStartButtons',
    'groupedRightHeaderEndButtons',
  ],
};

function enableActiveDraggingCSS(activeElement) {
  const elementType = activeElement.data.current.type;
  if (!elementType) {
    console.warn('FOUND ELEMENT WITH NO TYPE');
    return;
  }

  if (!dropTargets[elementType]) {
    console.warn(`NO DROP TARGETS FOUND FOR ${elementType}`);
    return;
  }

  const rootNode = getRootNode();

  dropTargets[elementType].forEach((dropTarget) => {
    const element = rootNode.querySelector(`[data-element="${dropTarget}"]`);
    if (element) {
      element.classList.add('drag-drop-target');
    }
  });
}

function disableActiveDraggingCSS(activeElement) {
  const elementType = activeElement.data.current.type;
  if (!elementType || !dropTargets[elementType]) {
    return;
  }

  const rootNode = getRootNode();

  dropTargets[elementType].forEach((dropTarget) => {
    const element = rootNode.querySelector(`[data-element="${dropTarget}"]`);
    if (element) {
      element.classList.remove('drag-drop-target');
    }
  });
}

export {
  enableActiveDraggingCSS,
  disableActiveDraggingCSS,
};