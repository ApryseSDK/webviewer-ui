export default (state, group, modification, defaultArr) => {
  if (defaultArr.includes(group)) {
    const groupIndex = defaultArr.indexOf(group);
    group.children = [ ...modification ];
    defaultArr.splice(groupIndex, 1, { ...group });
    return { ...state, headers: { default: [ ...defaultArr ] } };
  } else {
    const parentGroup = defaultArr.filter(buttonObject => buttonObject.children).find(buttonObject => buttonObject.children.includes(group));
    const parentGroupIndex = defaultArr.indexOf(parentGroup);
    const groupIndex = defaultArr[parentGroupIndex].children.indexOf(group);
    group.children = [ ...modification ];
    defaultArr[parentGroupIndex].children[groupIndex] = { ...group };
    defaultArr[parentGroupIndex].children = [ ...defaultArr[parentGroupIndex].children ];
    defaultArr.splice(parentGroupIndex, 1, { ...defaultArr[parentGroupIndex] });
    return { ...state, headers: { default: [ ...defaultArr ] } };
  }
};