class LocalStorageManager {
  constructor() {
    // Browser will throw an error after accessing window.localStorage
    // when loading webviewer through an iframe. So we add a catch.
    try {
      this.localStorageEnabled = !!window.localStorage;
    } catch (error) {
      console.error('window.localStorage unavailable. Disabling local storage.');
      this.localStorageEnabled = false;
    }
  }

  enableLocalStorage() {
    this.localStorageEnabled = true;
  }

  disableLocalStorage() {
    this.localStorageEnabled = false;
  }

  isLocalStorageEnabled() {
    return this.localStorageEnabled;
  }
}

export default new LocalStorageManager();