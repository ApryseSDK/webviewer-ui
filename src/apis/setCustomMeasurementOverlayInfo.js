import action from 'actions';


export default store => customOverlayInfo => {
  store.dispatch(action.setCustomMeasurementOverlay(customOverlayInfo));
};
