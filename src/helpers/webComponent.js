// If we have a shadowroot then we are in webcomponent and the active element will be further down
export const getDOMActiveElement = () => {
  let activeElement = document.activeElement;
  if (activeElement.shadowRoot) {
    activeElement = activeElement.shadowRoot.activeElement;
  }
  return activeElement;
};