import core from 'core';
import defaultToolStylesMap from 'constants/defaultToolStylesMap';
import localStorageManager from 'helpers/localStorageManager';

const setDefaultToolStyle = (toolName, documentViewer = undefined) => {
  let toolStyles = null;
  const toolModeMap = documentViewer ? documentViewer.getToolModeMap() : core.getToolModeMap();

  try {
    toolStyles = localStorage.getItem(`toolData-${toolName}`);
  } catch (ex) {
    console.warn('Disabling "localStorage" because it could not be accessed.');
    localStorageManager.disableLocalStorage();
  }

  if (!toolStyles && defaultToolStylesMap[toolName]) {
    toolStyles = JSON.stringify(defaultToolStylesMap[toolName]);
  }

  if (toolStyles) {
    const tool = toolModeMap[toolName];

    toolStyles = getParsedToolStyles(toolStyles);
    tool.setStyles(toolStyles);
  }
};

const setDefaultToolStyles = (documentViewer = undefined) => {
  const toolModeMap = documentViewer ? documentViewer.getToolModeMap() : core.getToolModeMap();

  Object.keys(toolModeMap).forEach((toolName) => {
    setDefaultToolStyle(toolName, documentViewer);
  });
};

const getParsedToolStyles = (toolStyles) => JSON.parse(toolStyles, (_, styles) => {
  if (styles) {
    Object.entries(styles).forEach(([key, style]) => {
      if (isKeyColorProperty(key) && typeof style === 'object') {
        styles[key] = new window.Annotations.Color(
          style.R,
          style.G,
          style.B,
          style.A,
        );
      }
    });
  }
  return styles;
});

const isKeyColorProperty = (key) => ['TextColor', 'StrokeColor', 'FillColor'].includes(key);

export default setDefaultToolStyles;

export { setDefaultToolStyle };
