import actions from 'actions';
import _isEqual from 'lodash/isEqual';
import setUIPropertiesForLayers from 'helpers/setUIPropertiesForLayers';

export default (newOCGLayers, currentOCGLayers, dispatch) => {
  const layersEqual = _isEqual(newOCGLayers, currentOCGLayers);
  if (!layersEqual) {
    const layersToSet = setUIPropertiesForLayers(newOCGLayers);
    dispatch(actions.setLayers(layersToSet));
  }
};