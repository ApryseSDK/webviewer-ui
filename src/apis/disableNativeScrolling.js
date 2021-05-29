import touchEventManager from 'helpers/TouchEventManager';

/**
 * Disable native mobile device scrolling behavior if it had previously been enabled. Note that native mobile device scrolling behavior is off by default.
 * @method UI.disableNativeScrolling
 * @example
WebViewer(...)
  .then(function(instance) {
    UI.disableNativeScrolling();
  });
 */

export default () => {
  touchEventManager.useNativeScroll = false;
};
