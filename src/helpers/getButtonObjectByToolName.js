const getButtonObjectByToolName = (state, toolName) => {
  const header = state.viewer.header;
  let buttonObject;
  header.forEach(element => {
    if (element.toolName === toolName) {
      buttonObject = element;
    }
    if (element.children) {
      element.children.forEach(childElement => {
        if (childElement.toolName === toolName) {
          buttonObject = childElement;
        }
        if (childElement.children) {
          childElement.children.forEach(grandChildElement => {
            if (grandChildElement.toolName === toolName) {
              buttonObject = grandChildElement;
            }
          });
        }
      });
    }
  });
  return buttonObject;
};

export default getButtonObjectByToolName;