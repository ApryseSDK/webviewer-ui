import hotkeysManager from 'helpers/hotkeysManager';

export default {
  on: (...args) => {
    hotkeysManager.on(...args);
  },
  off: (...args) => {
    hotkeysManager.off(...args);
  },
};
