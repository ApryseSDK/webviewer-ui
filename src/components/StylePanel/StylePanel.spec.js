import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import StylePanel from './index';
import core from 'core';

const getTool = () => ({
  name: 'AnnotationCreateRectangle',
  defaults: {
    'StrokeThickness': 1,
    'Opacity': 1,
  },
  setStyles: jest.fn(),
});

const mockAnnotation = {
  ToolName: 'AnnotationCreateRectangle',
  isContentEditPlaceholder: () => {},
  'StrokeThickness': 2.5,
  'Opacity': 1,
};

jest.mock('core', () => ({
  getDocumentViewer: () => {},
  isFullPDFEnabled: () => false,
  addEventListener: () => {},
  removeEventListener: () => {},
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
  })
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

const mockStore = configureStore({
  reducer: () => mockInitialState
});

const renderStylePanel = () => {
  render(
    <Provider store={mockStore}>
      <StylePanel />
    </Provider>
  );
};

describe('StylePanel', () => {
  it('should render correctly when a tool is active', () => {
    renderStylePanel();
    expect(screen.getByText('Rectangle Tool')).toBeInTheDocument();
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
    const getSelectedAnnotationsOverride = () => [mockAnnotation];
    jest.spyOn(core, 'getSelectedAnnotations').mockImplementation(getSelectedAnnotationsOverride);
    renderStylePanel();

    const slider = screen.getByRole('slider', { name: /stroke/i });

    fireEvent.change(slider, { target: { value: 5 } });
    expect(core.setAnnotationStyles).not.toHaveBeenCalled();

    fireEvent.mouseUp(slider);
    expect(core.setAnnotationStyles).toHaveBeenCalledTimes(1);
  });
});