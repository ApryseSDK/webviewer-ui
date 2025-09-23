import localStorageManager from 'helpers/localStorageManager';
import { getInstanceID } from 'helpers/getRootNode';

// return true if user already seen the warning model and agree to hide it
function isContentEditWarningHidden() {
  const instanceId = getInstanceID();
  if (localStorageManager.isLocalStorageEnabled() && localStorageManager.getItemSynchronous(`webviewer-${instanceId}-hideContentEditWarning`)) {
    return JSON.parse(localStorageManager.getItemSynchronous(`webviewer-${instanceId}-hideContentEditWarning`));
  }
  return false;
}

export default isContentEditWarningHidden;