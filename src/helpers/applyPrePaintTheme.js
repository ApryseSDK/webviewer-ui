export default function applyPrePaintTheme(theme, rootNode) {
  if (!theme) {
    return;
  }

  const htmlElement = rootNode?.documentElement || rootNode?.querySelector?.('html');
  if (htmlElement) {
    htmlElement.dataset.theme = theme;
  }
}