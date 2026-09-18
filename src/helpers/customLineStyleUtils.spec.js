import {
  getLineStyleAnnotationContext,
  getLineStyleDropdownEntries,
  lineStyleAppliesToContext,
  parseMiddleLineStyleValue,
} from './customLineStyleUtils';

describe('customLineStyleUtils', () => {
  it('limits internally registered styles to line-style contexts', () => {
    expect(lineStyleAppliesToContext({ appliesTo: ['line'] }, 'line')).toBe(true);
    expect(lineStyleAppliesToContext({ appliesTo: ['line'] }, 'rectangle')).toBe(false);
  });

  it('resolves the line creation tool context', () => {
    expect(getLineStyleAnnotationContext(true, 'AnnotationCreateLine')).toBe('line');
    expect(getLineStyleAnnotationContext(true, 'AnnotationCreateArrow3')).toBe('arrow');
    expect(getLineStyleAnnotationContext(true, 'AnnotationCreatePolyline')).toBe('polyline');
    expect(getLineStyleAnnotationContext(false, 'AnnotationCreateEllipse')).toBe('shape');
    expect(getLineStyleAnnotationContext(false, 'AnnotationCreateRectangle')).toBe('shape');
  });

  it('matches a style only against the line creation tools it applies to', () => {
    const arrowOnly = { appliesTo: ['arrow'] };
    expect(lineStyleAppliesToContext(arrowOnly, 'arrow')).toBe(true);
    expect(lineStyleAppliesToContext(arrowOnly, 'line')).toBe(false);
    expect(lineStyleAppliesToContext(arrowOnly, 'polyline')).toBe(false);
    expect(lineStyleAppliesToContext({ appliesTo: ['shape'] }, 'polyline')).toBe(false);
  });

  it('filters and converts styles through the shared dropdown contract', () => {
    expect(getLineStyleDropdownEntries([
      { key: 'line-only', appliesTo: ['line'] },
      { key: 'arrow-only', appliesTo: ['arrow'] },
    ], 'line')).toEqual([{
      key: 'line-only',
      src: '',
      title: 'line-only',
      className: 'linestyle-label',
    }]);
  });

  describe('parseMiddleLineStyleValue', () => {
    it('splits built-in dash patterns into a style and dash lengths', () => {
      expect(parseMiddleLineStyleValue('dash,2,2')).toEqual({ style: 'dash', dashes: ['2', '2'] });
      expect(parseMiddleLineStyleValue('dash,1,4,8,4')).toEqual({ style: 'dash', dashes: ['1', '4', '8', '4'] });
    });

    it('can read custom patterns with commas and not add dashes', () => {
      expect(parseMiddleLineStyleValue('wave,wide')).toEqual({ style: 'wave,wide', dashes: null });
      expect(parseMiddleLineStyleValue('dash-like,1,2')).toEqual({ style: 'dash-like,1,2', dashes: null });
    });
  });
});