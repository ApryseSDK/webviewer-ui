import localStorageManager from 'helpers/localStorageManager';

// return true if user already seen the warning model and agree to hide it
function isContentEditWarningHidden() {
  if (localStorageManager.isLocalStorageEnabled() && window.localStorage.getItem('hideContentEditWarning')) {
    return JSON.parse(window.localStorage.getItem('hideContentEditWarning'));
  }
  return false;
}

export default isContentEditWarningHidden;