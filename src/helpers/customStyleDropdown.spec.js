import { toDropdownEntry, styleAppliesToContext, getAnnotationContext } from './customStyleDropdown';

describe('toDropdownEntry', () => {
  it('uses the SVG and a key-derived class name when an SVG is provided', () => {
    expect(toDropdownEntry({ key: 'Fill Hatch/1', svg: '<svg></svg>', title: 'Hatch' })).toEqual({
      key: 'Fill Hatch/1',
      src: '<svg></svg>',
      title: 'Hatch',
      className: 'linestyle-image shift-alignment custom-line-style-image custom-line-style-image--fill-hatch-1',
    });
  });

  it('falls back to a label entry titled by key when no SVG or title is provided', () => {
    expect(toDropdownEntry({ key: 'fill-hatch' })).toEqual({
      key: 'fill-hatch',
      src: '',
      title: 'fill-hatch',
      className: 'linestyle-label',
    });
  });
});

describe('styleAppliesToContext', () => {
  it.each([
    [undefined, 'shape'],
    [[], 'shape'],
    [['all'], 'line'],
    [['ellipse'], 'ellipse'],
    [['shape'], 'rectangle'],
    [['shape'], 'ellipse'],
  ])('includes a style with appliesTo %p in the %s context', (appliesTo, context) => {
    expect(styleAppliesToContext({ appliesTo }, context)).toBe(true);
  });

  it.each([
    [['ellipse'], 'rectangle'],
    [['shape'], 'line'],
    [['rectangle'], 'line'],
  ])('excludes a style with appliesTo %p from the %s context', (appliesTo, context) => {
    expect(styleAppliesToContext({ appliesTo }, context)).toBe(false);
  });

  it('includes polygon styles in the cloud context', () => {
    expect(styleAppliesToContext({ appliesTo: ['polygon'] }, 'cloud')).toBe(true);
  });

  it('normalizes casing of appliesTo values', () => {
    expect(styleAppliesToContext({ appliesTo: ['Ellipse'] }, 'ellipse')).toBe(true);
  });
});

describe('getAnnotationContext', () => {
  it('returns line when line style options are shown', () => {
    expect(getAnnotationContext(true, 'AnnotationCreateRectangle')).toBe('line');
  });

  it.each([
    [['Ellipse'], 'ellipse'],
    [['circleAnnotation'], 'ellipse'],
    [['Rectangle'], 'rectangle'],
  ])('derives the context from the selected annotation types %p', (annotationTypes, expected) => {
    expect(getAnnotationContext(false, 'AnnotationCreateFreeHand', annotationTypes)).toBe(expected);
  });

  it.each([
    ['AnnotationCreateEllipse', 'ellipse'],
    ['AnnotationCreateRectangle', 'rectangle'],
    ['AnnotationCreatePolygon', 'polygon'],
    ['AnnotationCreateCloud', 'cloud'],
    [undefined, 'shape'],
  ])('falls back to the active tool %p', (activeTool, expected) => {
    expect(getAnnotationContext(false, activeTool)).toBe(expected);
  });

  it('falls back to the active tool when the selection mixes rectangles and ellipses', () => {
    expect(getAnnotationContext(false, 'AnnotationCreateEllipse', ['Rectangle', 'Ellipse'])).toBe('ellipse');
  });
});
