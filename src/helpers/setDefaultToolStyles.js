import core from 'core';
import defaultToolStylesMap from 'constants/defaultToolStylesMap';

const setDefaultToolStyles = () => {
  const toolModeMap = core.getToolModeMap();

  Object.keys(toolModeMap).forEach(toolName => {
    let toolStyles = localStorage.getItem(`toolData-${toolName}`);

    if (!toolStyles && defaultToolStylesMap[toolName]) {
      toolStyles = JSON.stringify(defaultToolStylesMap[toolName]);
    }

    if (toolStyles) {
      const tool = toolModeMap[toolName];

      toolStyles = getParsedToolStyles(toolStyles);
      tool.setStyles(oldStyle => ({
        ...oldStyle,
        ...toolStyles
      }));
    }
  });
};

const getParsedToolStyles = toolStyles => {
  return JSON.parse(toolStyles, (_, styles) => {
    Object.entries(styles).forEach(([ key, style ]) => {
      if (isKeyColorProperty(key) && typeof style === 'object') {
        styles[key] = new window.Annotations.Color(style.R, style.G, style.B, style.A); 
      }
    });

    return styles;
  });
};

const isKeyColorProperty = key => ['TextColor', 'StrokeColor', 'FillColor'].includes(key);

export default setDefaultToolStyles;