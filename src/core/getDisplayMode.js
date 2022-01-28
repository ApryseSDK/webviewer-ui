/**
 * https://www.pdftron.com/api/web/Core.DisplayModeManager.html#getDisplayMode__anchor
 * Note that getDisplayMode returns an object and this function returns mode property of that object.
 * If you want to get the object please use getDisplayModeObject
 */
export default () => window.documentViewer.getDisplayModeManager().getDisplayMode().mode;