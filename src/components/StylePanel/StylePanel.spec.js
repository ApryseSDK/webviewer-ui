import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import StylePanel from './index';
import core from 'core';
import i18next from 'i18next';
import actions from 'actions';
import viewerReducer from 'reducers/viewerReducer';
import { COLOR_PALETTE_STYLES } from 'src/constants/commonColors';

const getTool = () => ({
  name: 'AnnotationCreateRectangle',
  defaults: {
    'StrokeThickness': 1,
    'Opacity': 1,
  },
  setStyles: jest.fn(),
});

jest.mock('core', () => ({
  getDocumentViewer: () => {},
  isFullPDFEnabled: () => false,
  addEventListener: () => {},
  removeEventListener: () => {},
  canModify: () => true,
  getFormFieldCreationManager: () => ({
    isInFormFieldCreationMode: () => false,
  }),
  getTool: getTool,
  getToolMode:  () => getTool(),
  getToolModeMap: () => ({
    'AnnotationCreateRectangle': getTool(),
  }),
  getToolsFromAllDocumentViewers: jest.fn(() => [getTool()]),
  getSelectedAnnotations: () => [],
  setAnnotationStyles: jest.fn(),
  getAnnotationManager: () => ({
    redrawAnnotation: () => {},
    getGroupAnnotations: () => [],
  }),
  getDocument: () => ({
    getType: () => 'pdf',
  }),
}));

const mockInitialState = {
  ...initialState,
  viewer: {
    ...initialState.viewer,
    openElements: {
      ...initialState.viewer.openElements,
      stylePanel: true,
    },
  },
};

const createMockStore = () => configureStore({
  reducer: () => mockInitialState,
});

const renderStylePanel = () => {
  const store = createMockStore();
  render(
    <Provider store={store}>
      <StylePanel />
    </Provider>
  );
  return store;
};

const DEFAULT_CUSTOM_TEXT_COLORS = ['#111111']; // eslint-disable-line custom/no-hex-colors
const DEFAULT_CUSTOM_STROKE_COLORS = ['#222222']; // eslint-disable-line custom/no-hex-colors
const DEFAULT_CUSTOM_FILL_COLORS = ['#333333']; // eslint-disable-line custom/no-hex-colors
const SAMPLE_TOOL_OVERRIDE_COLORS = ['#AAAAAA']; // eslint-disable-line custom/no-hex-colors
const SAMPLE_REPLACEMENT_COLORS = ['#444444']; // eslint-disable-line custom/no-hex-colors

const createViewerStore = (viewerStateOverrides = {}) => configureStore({
  reducer: {
    viewer: viewerReducer({
      ...initialState.viewer,
      ...viewerStateOverrides,
    }),
  },
});

describe('StylePanel', () => {
  let getSelectedAnnotationsSpy;

  afterEach(async () => {
    getSelectedAnnotationsSpy?.mockRestore();
    getSelectedAnnotationsSpy = null;
    // ensure language is reset to english after each test
    await act(async () => {
      await i18next.changeLanguage('en');
    });
  });

  it('should render correctly when a tool is active', () => {
    renderStylePanel();
    expect(screen.getByText('Rectangle Tool')).toBeInTheDocument();
  });

  it('should re-render when language changes', async () => {
    renderStylePanel();
    expect(await screen.findByText('Rectangle Tool')).toBeInTheDocument();

    await act(async () => {
      await i18next.changeLanguage('fr');
    });
    expect(await screen.findByText('Rectangle Outil')).toBeInTheDocument();
  });

  it('triggers toolUpdated event only when user is done dragging slider', () => {
    renderStylePanel();
    const slider = screen.getByRole('slider', { name: /stroke/i });

    fireEvent.change(slider, { target: { value: 5 } });
    expect(core.getToolsFromAllDocumentViewers).not.toHaveBeenCalled();

    fireEvent.mouseUp(slider);
    expect(core.getToolsFromAllDocumentViewers).toHaveBeenCalledTimes(1);
  });

  it('triggers annotationChanged event only when user is done dragging slider', () => {
    const mockRectangle = new window.Core.Annotations.RectangleAnnotation();
    mockRectangle.StrokeThickness = 2.5;
    mockRectangle.Opacity = 1;
    const getSelectedAnnotationsOverride = () => [mockRectangle];
    getSelectedAnnotationsSpy = jest.spyOn(core, 'getSelectedAnnotations').mockImplementation(getSelectedAnnotationsOverride);
    renderStylePanel();

    const slider = screen.getByRole('slider', { name: /stroke/i });

    fireEvent.change(slider, { target: { value: 5 } });
    expect(core.setAnnotationStyles).not.toHaveBeenCalled();

    fireEvent.mouseUp(slider);
    expect(core.setAnnotationStyles).toHaveBeenCalledTimes(1);

    fireEvent.change(slider, { target: { value: 3 } });
    expect(core.setAnnotationStyles).toHaveBeenCalledTimes(1);

    fireEvent.touchEnd(slider);
    expect(core.setAnnotationStyles).toHaveBeenCalledTimes(2);

  });

  it('should not mutate Stroke/Text custom palettes when adding a custom Fill color', () => {
    const store = createViewerStore({
      customTextColors: DEFAULT_CUSTOM_TEXT_COLORS,
      customStrokeColors: DEFAULT_CUSTOM_STROKE_COLORS,
      customFillColors: DEFAULT_CUSTOM_FILL_COLORS,
    });
    const previousState = store.getState().viewer;
    const previousCustomTextColors = previousState.customTextColors;
    const previousCustomStrokeColors = previousState.customStrokeColors;
    const nextFillColors = SAMPLE_REPLACEMENT_COLORS;

    store.dispatch(actions.setCustomColors(COLOR_PALETTE_STYLES.FillColor.type, nextFillColors));

    const nextState = store.getState().viewer;
    expect(nextState.customFillColors).toEqual(nextFillColors);
    expect(nextState.customTextColors).toBe(previousCustomTextColors);
    expect(nextState.customStrokeColors).toBe(previousCustomStrokeColors);
  });

  it('should not overwrite the corresponding global palette when updating per-tool palette', () => {
    const toolName = 'AnnotationCreateRectangle';
    const nextFillColors = SAMPLE_REPLACEMENT_COLORS;
    const store = createViewerStore({
      fillColors: DEFAULT_CUSTOM_FILL_COLORS,
      toolColorOverrides: {
        [toolName]: {
          fillColors: SAMPLE_TOOL_OVERRIDE_COLORS,
        },
      },
    });

    const previousGlobalFillColors = store.getState().viewer.fillColors;

    store.dispatch(actions.setColors(nextFillColors, toolName, COLOR_PALETTE_STYLES.FillColor.type));

    const nextState = store.getState().viewer;
    expect(nextState.fillColors).toBe(previousGlobalFillColors);
    expect(nextState.fillColors).toEqual(DEFAULT_CUSTOM_FILL_COLORS);
    expect(nextState.toolColorOverrides[toolName].fillColors).toEqual(nextFillColors);
  });
});
