import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import LayersPanel from './LayersPanel';
import LayersPanelRedux from './LayersPanelRedux';

const TestLayersPanel = withI18n(LayersPanel);

const MOCK_LAYER_CLASS_NAME = 'layer';

jest.mock('components/Layer', () => {
  return function MockComponent({ layer }) {
    return (<div className={MOCK_LAYER_CLASS_NAME}>{layer.name || 'LayerMock'}</div>);
  };
});

const noop = () => {};

const mockDocument = {
  isWebViewerServerDocument: () => false,
  getLayersArray: () => Promise.resolve([]),
  setLayersArray: noop,
  addEventListener: noop,
  removeEventListener: noop,
};

const mockDocumentViewer = {
  getAnnotationManager: () => ({
    getAnnotationsList: () => [],
    drawAnnotationsFromList: noop,
  }),
  refreshAll: noop,
  updateView: noop,
  getDocument: () => mockDocument,
};

jest.mock('core', () => {
  const noop = () => {};
  return {
    addEventListener: noop,
    removeEventListener: noop,
    getDocument: () => mockDocument,
    getDocumentViewer: () => mockDocumentViewer,
    isFullPDFEnabled: () => false,
  };
});

function createStore(initialState) {
  return configureStore({
    reducer: (state = initialState) => state,
  });
}

const defaultButtonState = {
  viewer: { disabledElements: {}, customElementOverrides: {}, activeDocumentViewerKey: 1 },
};

function renderLayersPanel(props, state = defaultButtonState) {
  return render(
    <Provider store={createStore(state)}>
      <TestLayersPanel {...props} />
    </Provider>
  );
}

describe('Test for Layers Panel', () => {
  it('should be able to render without any props', () => {
    expect(() => {
      renderLayersPanel();
    }).not.toThrow();
  });
  it('should not be able to render Layers component with empty layers array props', () => {
    const layers = [

    ];
    const { container } = renderLayersPanel({ layers });
    const mockLayerComponents = container.querySelectorAll(`.${MOCK_LAYER_CLASS_NAME}`);
    expect(mockLayerComponents).toHaveLength(layers.length);
  });
  it('should not be able to render Layers component with 1 element in layers array', () => {
    // arbitrary unique keys
    const layers = [
      {
        id: 'a'
      }
    ];
    const { container } = renderLayersPanel({ layers });
    const mockLayerComponents = container.querySelectorAll(`.${MOCK_LAYER_CLASS_NAME}`);
    expect(mockLayerComponents).toHaveLength(layers.length);
  });
  it('should not be able to render Layers component with 2 elements in layers array', () => {
    // arbitrary unique keys
    const layers = [
      {
        id: 'a'
      },
      {
        id: 'b'
      }
    ];
    const { container } = renderLayersPanel({ layers });
    const mockLayerComponents = container.querySelectorAll(`.${MOCK_LAYER_CLASS_NAME}`);
    expect(mockLayerComponents).toHaveLength(layers.length);
  });
});

describe('Layers Panel - restore defaults button', () => {
  const mockLayers = [{ id: 'a' }];

  it('is disabled when layersHaveChanged is false and enabled when true', () => {
    const store = createStore(defaultButtonState);
    const { container, rerender } = render(
      <Provider store={store}>
        <TestLayersPanel layers={mockLayers} layersHaveChanged={false} restoreDefaultLayers={() => {}} />
      </Provider>
    );
    const restoreButton = container.querySelector('[data-element="layersPanelRestoreDefaultsButton"]');
    expect(restoreButton).toBeDisabled();

    rerender(
      <Provider store={store}>
        <TestLayersPanel layers={mockLayers} layersHaveChanged restoreDefaultLayers={() => {}} />
      </Provider>
    );
    expect(restoreButton).not.toBeDisabled();
  });

  it('calls restoreDefaultLayers when clicked', () => {
    const restoreDefaultLayers = jest.fn();
    const { container } = renderLayersPanel({ layers: mockLayers, layersHaveChanged: true, restoreDefaultLayers });
    const restoreButton = container.querySelector('[data-element="layersPanelRestoreDefaultsButton"]');

    fireEvent.click(restoreButton);

    expect(restoreDefaultLayers).toHaveBeenCalledTimes(1);
  });
});

describe('Layers Panel - MultiViewer Mode', () => {
  const viewer1Layers = [
    { id: 'v1-layer-1', name: 'Viewer1 Layer A' },
    { id: 'v1-layer-2', name: 'Viewer1 Layer B' },
  ];

  const viewer2Layers = [
    { id: 'v2-layer-1', name: 'Viewer2 Layer X' },
    { id: 'v2-layer-2', name: 'Viewer2 Layer Y' },
    { id: 'v2-layer-3', name: 'Viewer2 Layer Z' },
  ];

  const baseState = {
    viewer: {
      isMultiViewerMode: true,
      activeDocumentViewerKey: 1,
      disabledElements: {},
      customElementOverrides: {},
      openElements: {},
      flyoutMap: {},
    },
    document: {
      layers: {
        1: viewer1Layers,
        2: viewer2Layers,
      },
    },
    featureFlags: {},
    search: {},
  };

  it('should render layers from the second documentViewerKey when multiviewer mode is enabled', () => {
    const state = {
      ...baseState,
      viewer: { ...baseState.viewer, activeDocumentViewerKey: 2 },
    };

    const { container, getByText } = render(
      <Provider store={createStore(state)}>
        <LayersPanelRedux />
      </Provider>
    );

    expect(container.querySelectorAll(`.${MOCK_LAYER_CLASS_NAME}`)).toHaveLength(viewer2Layers.length);
    expect(getByText('Viewer2 Layer X')).toBeInTheDocument();
    expect(getByText('Viewer2 Layer Y')).toBeInTheDocument();
    expect(getByText('Viewer2 Layer Z')).toBeInTheDocument();
  });

  it('should switch from documentViewer 1 to 2 in multiviewer mode and update the rendered layers', () => {
    const stateViewer1 = {
      ...baseState,
      viewer: { ...baseState.viewer, activeDocumentViewerKey: 1 },
    };
    const stateViewer2 = {
      ...baseState,
      viewer: { ...baseState.viewer, activeDocumentViewerKey: 2 },
    };

    const { container, getByText, queryByText, rerender } = render(
      <Provider store={createStore(stateViewer1)}>
        <LayersPanelRedux />
      </Provider>
    );

    expect(container.querySelectorAll(`.${MOCK_LAYER_CLASS_NAME}`)).toHaveLength(viewer1Layers.length);
    expect(getByText('Viewer1 Layer A')).toBeInTheDocument();
    expect(getByText('Viewer1 Layer B')).toBeInTheDocument();
    expect(queryByText('Viewer2 Layer X')).not.toBeInTheDocument();

    rerender(
      <Provider store={createStore(stateViewer2)}>
        <LayersPanelRedux />
      </Provider>
    );

    expect(container.querySelectorAll(`.${MOCK_LAYER_CLASS_NAME}`)).toHaveLength(viewer2Layers.length);
    expect(getByText('Viewer2 Layer X')).toBeInTheDocument();
    expect(getByText('Viewer2 Layer Y')).toBeInTheDocument();
    expect(getByText('Viewer2 Layer Z')).toBeInTheDocument();
    expect(queryByText('Viewer1 Layer A')).not.toBeInTheDocument();
    expect(queryByText('Viewer1 Layer B')).not.toBeInTheDocument();
  });
});
