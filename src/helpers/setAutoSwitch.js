import { isIOS, isAndroid } from 'helpers/device';

export default () => {
  if (isIOS || isAndroid) {
    window.Tools.Tool.ENABLE_AUTO_SWITCH = false;
  }
};
