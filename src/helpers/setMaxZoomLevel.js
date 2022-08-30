import actions from 'actions';
import zoomFactors, { defaultZoomList } from 'constants/zoomFactors';
import getActualZoomLevel from './getActualZoomLevel';

export default (dispatch) => (zoomLevel) => {
  const maxZoom = getActualZoomLevel(zoomLevel);

  if (maxZoom) {
    const minZoom = zoomFactors.getMinZoomLevel();
    const zoomList = defaultZoomList.filter((zoom) => zoom <= maxZoom && zoom >= minZoom);
    zoomFactors.setMaxZoomLevel(maxZoom);
    dispatch(actions.setZoomList(zoomList));
    window.Core.Tools.MarqueeZoomTool.setMaxZoomLevel(maxZoom);
  } else {
    console.warn('Type of the argument for setMaxZoomLevel must be either string or number');
  }
};
