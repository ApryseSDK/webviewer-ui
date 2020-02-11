import touchEventManager from 'helpers/TouchEventManager';

export default useNativeScroll => {
  touchEventManager.useNativeScroll = useNativeScroll;
};