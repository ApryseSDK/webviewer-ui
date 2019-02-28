class LocalStorageManager {
  constructor() {
    this.localStorageEnabled = true;
  }

  enableLocalStorage() {
    this.localStorageEnabled = true;
  }

  disableLocalStorage() {
    this.localStorageEnabled = false;
  }

  isLocalStorageEnabled() {
    return this.localStorageEnabled
  }
}

export default new LocalStorageManager();