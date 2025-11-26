import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import StylePanel from './index';
import core from 'core';
import i18next from 'i18next';

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
});
