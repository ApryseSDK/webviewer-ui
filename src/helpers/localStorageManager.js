class LocalStorageManager {
  constructor() {
    this.localStorageEnabled = !!window.localStorage;
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