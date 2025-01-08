import { createStore } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import { render, screen } from '@testing-library/react';
import ScaleOverlayContainer from './ScaleOverlayContainer';

class MockScale {
  MockScale(scale) {
    this.scale = scale;
  }
  toString() {
    return `${this.scale.pageScale.value} ${this.scale.pageScale.unit} = ${this.scale.worldScale.value} ${this.scale.worldScale.unit}`;
  }
}

const initialState = {
  viewer: {
    documentContainerHeight: 320,
    customElementOverrides: {},
    openElements: {},
    disabledElements: {},
    scaleOverlayPosition: 'top-right',
    calibrationInfo: {
      isCalibration: false,
      tempScale: '',
      previousToolName: '',
      isFractionalUnit: false,
      defaultUnit: '',
    },
    selectedScale: { pageScale: { value: 1, unit: 'in' }, worldScale: { value: 1, unit: 'in' }, toString: () => '1 in = 1 in scale' },
  }
};

function rootReducer(state = initialState, action) { // eslint-disable-line no-unused-vars
  return state;
}

const store = createStore(rootReducer);
const ScaleOverlayContainerWithRedux = (props) => (
  <Provider store={store}>
    <ScaleOverlayContainer {...props} />
  </Provider>
);

jest.mock('core', () => ({
  Scale: MockScale,
  getViewerElement: () => {},
  getScrollViewElement: () => {},
  getScales: () => ({
    '1 in = 1 in': [],
  }),
  getScalePrecision: () => 0.1,
  addEventListener: () => {},
  removeEventListener: () => {},
}));

const props = {
  annotations: [],
  selectedTool: undefined,
};

// Helper function that allows us to inject different context scenarios to test with
const customRenderWithContext = () => {
  return render(
    <ScaleOverlayContainerWithRedux {...props} />,
  );
};

describe('ScaleOverlayContainer', () => {
  it('Scale overlay component has aria label', () => {
    customRenderWithContext();

    const scaleDropdown = screen.getByTestId('scale-selector');
    scaleDropdown.click();
    expect(scaleDropdown).toHaveAttribute('aria-labelledby', 'scale-dropdown-label');

    const deleteScaleButton = screen.getByLabelText('Delete 1 in = 1 in');
    expect(deleteScaleButton).toHaveClass('delete', { exact: true });
  });
});
