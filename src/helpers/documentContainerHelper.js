import { isIEEdge, isIE11 } from 'helpers/device';

// When a panel opens/closes, we want to shift the container accordingly
// The normal way to do this is through css
// For example, when left panel opens, we add 'left-panel' to the className, make the container width become calc(100%-#{$left-panel-width})
// and use css transition to achieve a smooth panel opening animation
// However, IE11 and Edge haven't supported using transition and calc(...) together, 
// So we have to calculate the width manually.
export const updateContainerWidth = (prevProps, props, container) =>  {
  const leftPanelWidth = 300;
  const rightPanelWidth = 300;

  const leftPanelClosed = prevProps.isLeftPanelOpen && !props.isLeftPanelOpen; 
  if (leftPanelClosed) {
    expandContainerWidthBy(leftPanelWidth, container);
    container.style.marginLeft = '0px';
  }
  
  const rightPanelClosed = prevProps.isRightPanelOpen && !props.isRightPanelOpen; 
  if (rightPanelClosed) {
    expandContainerWidthBy(rightPanelWidth, container);
  }

  const leftPanelOpened = !prevProps.isLeftPanelOpen && props.isLeftPanelOpen; 
  if (leftPanelOpened) {
    shrinkContainerWidthBy(leftPanelWidth, container);
    container.style.marginLeft = `${leftPanelWidth}px`;
  }

  const rightPanelOpened = !prevProps.isRightPanelOpen && props.isRightPanelOpen; 
  if (rightPanelOpened) {
    shrinkContainerWidthBy(rightPanelWidth, container);
  }  
};

const expandContainerWidthBy = (panelWidth, container) => {
  const containerWidth = parseInt(window.getComputedStyle(container).width, 10);
  
  if (isIEEdge) {
    container.style.width = `${containerWidth + panelWidth}px`;
  }

  if (isIE11) {
    const scrollBarWidth = 17;
    container.style.width = `${containerWidth + panelWidth + scrollBarWidth}px`;
  }
};

const shrinkContainerWidthBy = (panelWidth, container) => {
  const containerWidth = parseInt(window.getComputedStyle(container).width, 10);
  
  if (isIEEdge) {
    container.style.width = `${containerWidth - panelWidth}px`;
  }

  if (isIE11) {
    const scrollBarWidth = 17;
    container.style.width = `${containerWidth - panelWidth + scrollBarWidth}px`;
  }  
};

export const getClassNameInIE = ({ isHeaderOpen, isSearchOverlayOpen }) => { 
  return [
    'DocumentContainer',
    isHeaderOpen ? 'full-height' : '',
    isSearchOverlayOpen ? 'search-overlay' : ''
  ].join(' ').trim();
};

export const handleWindowResize = ({ isLeftPanelOpen, isRightPanelOpen }, container) =>  {
  const leftPanelWidth = 300;
  const rightPanelWidth = 300;
  let width = window.innerWidth;

  if (isLeftPanelOpen) {
    width -= leftPanelWidth;
  }
  
  if (isRightPanelOpen) {
    width -= rightPanelWidth;
  }

  container.style.width = `${width}px`;
};
