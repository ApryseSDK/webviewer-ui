import localStorageManager from 'helpers/localStorageManager';
import { getInstanceID } from 'helpers/getRootNode';

// return true if user already seen the warning model and agree to hide it
function isContentEditWarningHidden() {
  const instanceId = getInstanceID();
  if (localStorageManager.isLocalStorageEnabled() && window.localStorage.getItem(`${instanceId}-hideContentEditWarning`)) {
    return JSON.parse(window.localStorage.getItem(`${instanceId}-hideContentEditWarning`));
  }
  return false;
}

export default isContentEditWarningHidden;