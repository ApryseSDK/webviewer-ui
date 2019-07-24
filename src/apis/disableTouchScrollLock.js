import TouchEventManager from 'helpers/TouchEventManager';

/**
 * Disable locking for when scrolling on touch screen
 * @method WebViewer#disableTouchScrollLock
*/
export default () => {
  TouchEventManager.enableTouchScrollLock = false;
};
