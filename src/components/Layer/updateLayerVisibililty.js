const updateChildrenDisabledState = parentLayer => {
  const newParentLayer = { ...parentLayer };
  newParentLayer.children && newParentLayer.children.forEach((childLayer, i) => {
    let newChildLayer = { ...childLayer };
    if (!newChildLayer.locked) {
      newChildLayer.disabled = !newParentLayer.visible;
      newChildLayer = updateChildrenDisabledState(newChildLayer);
    }
    newParentLayer.children[i] = newChildLayer;
  });
  return newParentLayer;
};

const updateChildrenVisibilityState = parentLayer => {
  const newParentLayer = { ...parentLayer };
  newParentLayer.children && newParentLayer.children.forEach((childLayer, i) => {
    let newChildLayer = { ...childLayer };
    if (newParentLayer.visible) {
      newChildLayer.visible = !!newChildLayer.prevVisibleState;
    } else {
      newChildLayer.visible = false;
    }
    newChildLayer = updateChildrenVisibilityState(newChildLayer);
    newParentLayer.children[i] = newChildLayer;
  });
  return newParentLayer;
};

export function updateLayerVisibililty(layerToUpdate, newVisibililtyState) {
  if (layerToUpdate.locked || layerToUpdate.disabled) {
    return layerToUpdate;
  }
  let newLayer = { ...layerToUpdate };
  newLayer.visible = newVisibililtyState;
  newLayer.prevVisibleState = newLayer.visible;
  if (newLayer.children && newLayer.children.length > 0) {
    newLayer = updateChildrenVisibilityState(newLayer);
    newLayer = updateChildrenDisabledState(newLayer);
  }
  return newLayer;
}