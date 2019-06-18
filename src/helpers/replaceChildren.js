// helper method to replace children of group buttons
export default (state, group, modification, defaultArr) => {
  // if the group that the children are being replaced is in the header
  if (defaultArr.includes(group)) {
    const groupIndex = defaultArr.indexOf(group);
    group.children = [ ...modification ];
    defaultArr.splice(groupIndex, 1, { ...group });
  } else {
    // else if replacing children of a nested group;
    const parentGroup = defaultArr.filter(buttonObject => buttonObject.children).find(buttonObject => buttonObject.children.includes(group));
    const parentGroupIndex = defaultArr.indexOf(parentGroup);
    const groupIndex = defaultArr[parentGroupIndex].children.indexOf(group);
    group.children = [ ...modification ];
    defaultArr[parentGroupIndex].children[groupIndex] = { ...group };
    defaultArr[parentGroupIndex].children = [ ...defaultArr[parentGroupIndex].children ];
    defaultArr.splice(parentGroupIndex, 1, { ...defaultArr[parentGroupIndex] });
  }
  return { ...state, header: [ ...defaultArr ] };
};