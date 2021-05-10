import actions from 'actions';
import equal from 'fast-deep-equal';
import setUIPropertiesForLayers from 'helpers/setUIPropertiesForLayers';
export default (newOCGLayers, currentOCGLayers, dispatch) => {
  const isEqual = equal(newOCGLayers, currentOCGLayers);
  if (!isEqual) {
    const layersToSet = setUIPropertiesForLayers(newOCGLayers);
    dispatch(actions.setLayers(layersToSet));
  }
};