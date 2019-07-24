import TouchEventManager from 'helpers/TouchEventManager';

/**
 * Enables locking for when scrolling on touch screen
 * @method WebViewer#enableTouchScrollLock
*/
export default () => {
  TouchEventManager.enableTouchScrollLock = true;
};
