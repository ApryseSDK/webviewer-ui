import touchEventManager from 'helpers/TouchEventManager';

/**
 * Enable native mobile device scrolling behavior. By default custom behavior is used to handle vertical and horizontal scroll locking.
 * @method UI.enableNativeScrolling
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.enableNativeScrolling();
  });
 */

export default () => {
  touchEventManager.useNativeScroll = true;
};
