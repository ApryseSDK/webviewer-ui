const getHeaderItemByToolName = (state, toolName) => {
  const header = state.viewer.header;
  for (let i = 0; i < header.length; i++) {
    let headerItem = findHeaderItem(header[i], toolName);
    if (headerItem) {
      return headerItem;
    }
  }
};

// Recursive helper function to find header item using depth first search
const findHeaderItem = (item, toolName) => {
  if (item.toolName === toolName) {
    return item;
  }
  if (item.children) { 
    for (let i = 0; i < item.children.length; i++) {
      let headerItem = findHeaderItem(item.children[i], toolName);
      if (headerItem) {
        return headerItem;
      }
    }
  }
};

export default getHeaderItemByToolName;