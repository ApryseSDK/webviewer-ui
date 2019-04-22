  const getButtonObjectByToolName = (state, toolName) => {
    const defaultHeader = state.viewer.headers.default;
    let buttonObject;
    defaultHeader.forEach(element => {
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
    return buttonObject
  };

  export default getButtonObjectByToolName;