import { renderHook } from '@testing-library/react-hooks';
import * as reactRedux from 'react-redux';
import core from 'core';
import useStylePanel from './useStylePanel';

jest.mock('core');

describe('useStylePanel - applyFreeTextStyles', () => {
  let activeToolStyles;

  beforeEach(() => {
    activeToolStyles = {};
    core.isFullPDFEnabled = jest.fn(() => false);
    core.getToolMode = jest.fn(() => null);

    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(jest.fn());
    jest.spyOn(reactRedux, 'useSelector').mockImplementation((selector) => {
      const selectorString = selector.toString();
      if (selectorString.includes('getToolButtonObjects')) {
        return {};
      }
      if (selectorString.includes('isAnnotationToolStyleSyncingEnabled')) {
        return false;
      }
      if (selectorString.includes('getActiveDocumentViewerKey')) {
        return 1;
      }
      if (selectorString.includes('getActiveToolStyles')) {
        return activeToolStyles;
      }
      return undefined;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Creates a minimal FreeTextAnnotation-like object with just the members
  // applyFreeTextStyles reads from. Uses the real window.Core.Annotations.FreeTextAnnotation
  // (loaded from the core bundle by jest setup) since useStylePanel.js captures
  // `Annotations` from window.Core at module-import time, so instanceof checks only work
  // against that same real class (see TextStylePanel.spec.js for the same pattern).
  const createFreeTextAnnotation = ({ font, richTextStyle, contents }) => {
    const annotation = new window.Core.Annotations.FreeTextAnnotation();
    annotation.ToolName = 'AnnotationCreateFreeText';
    annotation.Font = font;
    annotation.FontSize = 12;
    annotation.TextAlign = 'left';
    annotation.TextVerticalAlign = 'top';
    annotation.Style = 'solid';
    annotation.Dashes = null;
    annotation.getRichTextStyle = () => richTextStyle;
    annotation.getContents = () => contents;
    annotation.getCalculatedFontSize = () => '12pt';
    annotation.isAutoSizeFont = () => false;
    annotation.isContentEditPlaceholder = () => false;
    return annotation;
  };

  // selectedAnnotations must be a stable reference across renders (not an inline array
  // literal created inside the renderHook callback), otherwise useStylePanel's useEffect
  // dependency array changes every render and causes an infinite update loop.
  const renderStylePanel = (annotation) => {
    const selectedAnnotations = [annotation];
    return renderHook(() => useStylePanel({ selectedAnnotations, currentTool: null }));
  };

  it('uses the single font found in the text run even when the base Font is blank', () => {
    const annotation = createFreeTextAnnotation({
      font: '',
      richTextStyle: { 0: { 'font-family': 'Helvetica', 'font-size': '12pt' } },
      contents: 'Hi',
    });

    const { result } = renderStylePanel(annotation);

    expect(result.current.annotationStyle.Font).toBe('Helvetica');
  });

  it('sets Font to undefined (mixed) when the text run contains multiple distinct fonts', () => {
    const annotation = createFreeTextAnnotation({
      font: 'Arial',
      richTextStyle: {
        0: { 'font-family': 'Helvetica', 'font-size': '12pt' },
        1: { 'font-family': 'Courier', 'font-size': '14pt' },
      },
      contents: 'Hi',
    });

    const { result } = renderStylePanel(annotation);

    expect(result.current.annotationStyle.Font).toBeUndefined();
  });

  it('resets the selected fill style when the same annotation object is mutated back to the default solid fill', () => {
    const selectedAnnotations = [];
    const annotation = new window.Core.Annotations.RectangleAnnotation();
    annotation.ToolName = 'AnnotationCreateRectangle';
    annotation.FillStyle = 'custom-fill';
    annotation.StrokeColor = null;
    annotation.StrokeThickness = null;
    annotation.Opacity = null;
    annotation.FillColor = null;
    annotation.isContentEditPlaceholder = () => false;
    selectedAnnotations.push(annotation);

    const { result, rerender } = renderHook(() => useStylePanel({ selectedAnnotations, currentTool: null }));

    expect(result.current.fillStyle).toBe('custom-fill');

    annotation.FillStyle = '';
    rerender();

    expect(result.current.fillStyle).toBe('');
  });

  it('updates line style dropdowns when active tool styles are reset', () => {
    const selectedAnnotations = [];
    const currentTool = {
      name: 'AnnotationCreateLine',
      defaults: {
        StartLineStyle: 'custom-start',
        StrokeStyle: 'custom-middle',
        EndLineStyle: 'custom-end',
      },
    };
    core.getTool = jest.fn(() => currentTool);

    const { result, rerender } = renderHook(() => useStylePanel({ selectedAnnotations, currentTool }));

    expect(result.current.startLineStyle).toBe('custom-start');
    expect(result.current.strokeStyle).toBe('custom-middle');
    expect(result.current.endLineStyle).toBe('custom-end');

    Object.assign(currentTool.defaults, {
      StartLineStyle: 'None',
      StrokeStyle: 'solid',
      EndLineStyle: 'None',
    });
    activeToolStyles = { ...currentTool.defaults };
    rerender();

    expect(result.current.startLineStyle).toBe('None');
    expect(result.current.strokeStyle).toBe('solid');
    expect(result.current.endLineStyle).toBe('None');
  });

  it('falls back to the annotation base Font when the rich text style has no font-family data', () => {
    const annotation = createFreeTextAnnotation({
      font: 'Arial',
      richTextStyle: {},
      contents: 'Hi',
    });

    const { result } = renderStylePanel(annotation);

    expect(result.current.annotationStyle.Font).toBe('Arial');
  });
});
