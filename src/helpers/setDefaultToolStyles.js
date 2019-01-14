import core from 'core';

const setDefaultToolStyles = () => {
  const toolModeMap = core.getToolModeMap();

  Object.keys(toolModeMap).forEach(toolName => {
    let toolStyles = localStorage.getItem(`toolData-${toolName}`);

    if (toolStyles) {
      toolStyles = getParsedToolStyles(toolStyles);  
    } else {
      toolStyles = defaultToolStylesMap[toolName];
    }

    if (toolStyles) {
      const tool = toolModeMap[toolName];
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
      if (typeof style === 'object') {
        styles[key] = new window.Annotations.Color(style.R, style.G, style.B, style.A); 
      }
    });

    return styles;
  });
};

const convertHexToColor = hexColor => {
  const rgba = hexColor.match(/.{2}/g).map(c => parseInt(c, 16));

  return new window.Annotations.Color(rgba[0], rgba[1], rgba[2], rgba[3]);
};

// default styles of a tool is determined by core
// following are the tools that we want to change the default styles due to design
// we could change the default styles in core but we don't want the legacy UI to be affected, so we do it here
const defaultToolStylesMap = {
  AnnotationCreateFreeHand: {
    StrokeColor: convertHexToColor('E44234'),
  },
  AnnotationCreateFreeHand2: {
    StrokeColor: convertHexToColor('00CC63'),
  },
  AnnotationCreateFreeHand3: {
    StrokeColor: convertHexToColor('4E7DE9'),
  },
  AnnotationCreateFreeHand4: {
    StrokeColor: convertHexToColor('000000'),
  },
  AnnotationCreateTextHighlight: {
    StrokeColor: convertHexToColor('FFE6A2'),
  },
  AnnotationCreateTextHighlight2: {
    StrokeColor: convertHexToColor('92E8E8'),
  },
  AnnotationCreateTextHighlight3: {
    StrokeColor: convertHexToColor('80E5B1'),
  },
  AnnotationCreateTextHighlight4: {
    StrokeColor: convertHexToColor('F1A099'),
  },
  AnnotationCreateTextUnderline: {
    StrokeColor: convertHexToColor('E44234'),
  },
  AnnotationCreateTextSquiggly: {
    StrokeColor: convertHexToColor('E44234'),
  },
  AnnotationCreateTextStrikeout: {
    StrokeColor: convertHexToColor('E44234'),
  },
  AnnotationCreateFreeText: {
    TextColor: convertHexToColor('E44234'),
  },
  AnnotationCreateSticky: {
    StrokeColor: convertHexToColor('FFE6A2')
  },
};

export default setDefaultToolStyles;