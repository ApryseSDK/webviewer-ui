export default (layers) => {
  const newLayers = [];
  if (layers) {
    layers.forEach((layer, index) => {
      const newLayer = createNewLayer(layer, `${index}`, layer.locked);
      newLayers.push(newLayer);
      newLayer.children = setIdsForChildren(layer.children, `${newLayer.id}`, newLayer.disabled, []);
    });
  }
  return newLayers;
};

const setIdsForChildren = (layers, parentLayerId, isParentDisabled, resultSoFar) => {
  if (!layers || layers.length === 0) {
    return resultSoFar;
  }
  layers.forEach((layer, index) => {
    const newLayer = createNewLayer(layer, `${parentLayerId}-${index}`, isParentDisabled || layer.locked);
    if (layer.children && layer.children.length > 0) {
      newLayer.children = setIdsForChildren(layer.children, `${newLayer.id}`, newLayer.disabled, []);
    }
    resultSoFar.push(newLayer);
  });
  return resultSoFar;
};

const createNewLayer = (layer, layerId, isDisabled) => {
  const newLayer = {
    ...layer,
    children: [],
    prevVisibleState: !!layer.visible,
    visible: !!layer.visible,
    id: layerId,
    disabled: !!isDisabled,
    // this is how WV core knows it is a label
    isLabel: (layer.visible === undefined && layer.obj === undefined)
  };
  return newLayer;
};