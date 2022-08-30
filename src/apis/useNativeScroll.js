import touchEventManager from 'helpers/TouchEventManager';

/**
 * @deprecated Since version 8.0.
 */
export default (useNativeScroll) => {
  console.warn('Deprecated since version 8.0. Please use enableNativeScrolling and disableNativeScrolling instead');
  touchEventManager.useNativeScroll = useNativeScroll;
};