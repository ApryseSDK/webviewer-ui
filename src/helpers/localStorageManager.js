const WEBVIEWER_STORAGE_PATTERN = [
  'wc--toolData',
  'wc-viewer',
  'webviewer',
  'default-toolData',
];

class LocalStorageManager {

  constructor() {
    // Browser will throw an error after accessing window.localStorage
    // when loading webviewer through an iframe. So we add a catch.
    try {
      this.localStorageEnabled = window.localStorage !== undefined && window.localStorage !== null;
    } catch (error) {
      console.error('window.localStorage unavailable. Disabling local storage.');
      this.localStorageEnabled = false;
    }
  }

  /**
   * Sets an item in local storage.
   * @param {string} key - The key to set.
   * @param {string} value - The value to set.
   * @returns {Promise<void>}
   * @ignore
   */
  setItem(key, value) {
    return new Promise((resolve) => {
      if (this.localStorageEnabled) {
        window.localStorage.setItem(key, value);
        resolve();
      } else {
        console.warn('Local storage is disabled. Cannot set item:', key);
        resolve();
      }
    });
  }

  /**
   * Sets an item in local storage.
   * @param {string} key - The key to set.
   * @param {string} value - The value to set.
   * @returns {void}
   * @ignore
   */
  setItemSynchronous(key, value) {
    if (this.localStorageEnabled) {
      window.localStorage.setItem(key, value);
    } else {
      console.warn('Local storage is disabled. Cannot set item:', key);
    }
  }

  /**
   * Gets an item from local storage.
   * @param {string} key - The key to retrieve.
   * @returns {Promise<string|null>}
   * @ignore
   */
  getItem(key) {
    return new Promise((resolve) => {
      if (this.localStorageEnabled) {
        resolve(window.localStorage.getItem(key));
      } else {
        console.warn('Local storage is disabled. Cannot get item:', key);
        resolve(null);
      }
    });
  }

  /**
   * Gets an item from local storage.
   * @param {string} key - The key to retrieve.
   * @returns {string|null}
   * @ignore
   */
  getItemSynchronous(key) {
    if (this.localStorageEnabled) {
      return window.localStorage.getItem(key);
    } else {
      console.warn('Local storage is disabled. Cannot get item:', key);
      return null;
    }
  }

  /**
   * Removes a key from local storage.
   * @param {string} key - The key to remove.
   * @returns {Promise<void>}
   * @ignore
   */
  removeKey(key) {
    return new Promise((resolve) => {
      if (this.localStorageEnabled) {
        window.localStorage.removeItem(key);
        resolve();
      } else {
        console.warn('Local storage is disabled. Cannot remove item:', key);
        resolve();
      }
    });
  }

  /**
   * Removes a key from local storage.
   * @param {string} key - The key to remove.
   * @returns {void}
   * @ignore
   */
  removeKeySynchronous(key) {
    if (this.localStorageEnabled) {
      window.localStorage.removeItem(key);
    } else {
      console.warn('Local storage is disabled. Cannot remove item:', key);
    }
  }

  /**
   * Enables local storage.
   * @returns {void}
   * @ignore
   */
  enableLocalStorage() {
    this.localStorageEnabled = true;
  }

  /**
   * Disables local storage by removing all keys that match the WEBVIEWER_STORAGE_PATTERN.
   * @returns {void}
   * @ignore
   */
  disableLocalStorage() {
    Object.keys(window.localStorage).forEach((key) => {
      if (WEBVIEWER_STORAGE_PATTERN.some((pattern) => key.includes(pattern))) {
        window.localStorage.removeItem(key);
      }
    });

    this.localStorageEnabled = false;
  }

  /**
   * @returns true if local storage is enabled, false otherwise.
   * @ignore
   */
  isLocalStorageEnabled() {
    return this.localStorageEnabled;
  }
}

export default new LocalStorageManager();
