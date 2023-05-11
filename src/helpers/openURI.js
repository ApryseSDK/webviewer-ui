export default function openURI(uri, isOpenInNewWindow) {
  let target = uri.trim();

  // if it has :// then assume it's using an internal protocol and don't change the link
  if (target.indexOf('://') === -1) {
    if (target.indexOf('@') !== -1) {
      target = `mailto:${target}`;
    } else {
      // unknown or missing URI scheme, default to http://
      target = `http://${target}`;
    }
  }

  if (isOpenInNewWindow) {
    const newWindow = window.open(target);
    if (newWindow) {
      newWindow.opener = null;
    }
  } else {
    window.location = target;
  }
}