/**
 * Gets the watermark options created in print modal.
 * @method UI.getWatermarkModalOptions
 * @return {object} Returns the watermark options created in print modal.
 */
import selectors from 'selectors';

export default store => () => selectors.getWatermarkModalOptions(store.getState());