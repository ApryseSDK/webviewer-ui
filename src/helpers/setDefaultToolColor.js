import core from 'core';

/**
 * Default color of a tool is determined by webviewer core,
 * but in the current design we need to change the default color for some tools.
 */
const setDefaultToolColor = () => {
  const toolNames = [
    'AnnotationCreateFreeHand',
    'AnnotationCreateFreeHand2',
    'AnnotationCreateFreeHand3',
    'AnnotationCreateFreeHand4',
    'AnnotationCreateTextHighlight',
    'AnnotationCreateTextHighlight2',
    'AnnotationCreateTextHighlight3',
    'AnnotationCreateTextHighlight4',
    'AnnotationCreateTextUnderline',
    'AnnotationCreateTextSquiggly',
    'AnnotationCreateTextStrikeout',
    'AnnotationCreateFreeText',
    'AnnotationCreateSticky'
  ];

  toolNames.forEach(toolName => {
    const tool = core.getTool(toolName);
    const colorProperty = mapToolNameToColorProperty[toolName];
    
    tool.defaults[colorProperty] = mapToolNameToDefaultColor[toolName];
  });
};

const mapToolNameToColorProperty = {
  AnnotationCreateFreeHand: 'StrokeColor',
  AnnotationCreateFreeHand2: 'StrokeColor',
  AnnotationCreateFreeHand3: 'StrokeColor',
  AnnotationCreateFreeHand4: 'StrokeColor',
  AnnotationCreateTextHighlight: 'StrokeColor',
  AnnotationCreateTextHighlight2: 'StrokeColor',
  AnnotationCreateTextHighlight3: 'StrokeColor',
  AnnotationCreateTextHighlight4: 'StrokeColor',
  AnnotationCreateTextUnderline: 'StrokeColor',
  AnnotationCreateTextSquiggly: 'StrokeColor',
  AnnotationCreateTextStrikeout: 'StrokeColor',
  AnnotationCreateFreeText: 'TextColor',
  AnnotationCreateSticky: 'StrokeColor'
};

const convertHexToColor = hexColor => {
  const rgba = hexColor.match(/.{2}/g).map(c => parseInt(c, 16));

  return new window.Annotations.Color(rgba[0], rgba[1], rgba[2], rgba[3]);
};

const mapToolNameToDefaultColor = {
  AnnotationCreateFreeHand: convertHexToColor('E44234'),
  AnnotationCreateFreeHand2: convertHexToColor('00CC63'),
  AnnotationCreateFreeHand3: convertHexToColor('4E7DE9'),
  AnnotationCreateFreeHand4: convertHexToColor('000000'),
  AnnotationCreateTextHighlight: convertHexToColor('FFE6A2'),
  AnnotationCreateTextHighlight2: convertHexToColor('92E8E8'),
  AnnotationCreateTextHighlight3: convertHexToColor('80E5B1'),
  AnnotationCreateTextHighlight4: convertHexToColor('F1A099'),
  AnnotationCreateTextUnderline: convertHexToColor('E44234'),
  AnnotationCreateTextSquiggly: convertHexToColor('E44234'),
  AnnotationCreateTextStrikeout: convertHexToColor('E44234'),
  AnnotationCreateFreeText: convertHexToColor('E44234'),
  AnnotationCreateSticky: convertHexToColor('FFE6A2')
};

export default setDefaultToolColor;