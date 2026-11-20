import { Provider } from 'react-redux';
import React from 'react';
import { render, screen } from '@testing-library/react';
import ScaleOverlayContainer from './ScaleOverlayContainer';
import { configureStore } from '@reduxjs/toolkit';
import useCore from 'hooks/useCore';

let currentCore;

const createCoreMock = (scales, { canModify = true } = {}) => ({
  getScales: jest.fn(() => scales),
  getScalePrecision: jest.fn(() => 0.1),
  canModify: jest.fn(() => canModify),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getDocumentViewer: jest.fn(() => ({})),
  deleteScale: jest.fn(),
});

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
    isMultipleScalesMode: false,
    scaleOverlayPosition: 'top-right',
    calibrationInfo: {
      isCalibration: false,
      tempScale: '',
      previousToolName: '',
      isFractionalUnit: false,
      defaultUnit: '',
    },
    selectedScale: { pageScale: { value: 1, unit: 'in' }, worldScale: { value: 1, unit: 'in' }, toString: () => '1 in = 1 in scale' },
    toolButtonObjects: {
      'AnnotationCreateDistanceMeasurement': {
        dataElement: 'distanceMeasurementToolButton'
      }
    },
  }
};

const createStore = (stateOverrides = {}) => {
  const state = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      ...stateOverrides.viewer,
    },
  };
  const rootReducer = (currentState = state, action) => currentState; // eslint-disable-line no-unused-vars
  return configureStore({ reducer: rootReducer });
};

jest.mock('core', () => ({
  Scale: MockScale,
  getViewerElement: jest.fn(),
  getScrollViewElement: jest.fn(),
  getDocument: jest.fn(),
  getScales: jest.fn(() => ({
    '1 in = 1 in': [{}],
  })),
  getScalePrecision: jest.fn(() => 0.1),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getDocumentViewer: jest.fn(() => ({})),
}));

jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const props = {
  annotations: [],
  selectedTool: { name: 'AnnotationCreateDistanceMeasurement' },
};

// Helper function that allows us to inject different context scenarios to test with
const customRenderWithContext = (stateOverrides) => {
  const store = createStore(stateOverrides);
  return render(
    <Provider store={store}>
      <ScaleOverlayContainer {...props} />
    </Provider>,
  );
};

describe('ScaleOverlayContainer', () => {
  beforeEach(() => {
    window.Core = window.Core || {};
    window.Core.Annotations = window.Core.Annotations || {};
    window.Core.Annotations.Annotation = window.Core.Annotations.Annotation || class Annotation {};

    currentCore = createCoreMock({
      '1 in = 1 in': [{}],
    });
    useCore.mockReturnValue({ core: currentCore });
  });

  it('Scale overlay component has aria label', () => {
    customRenderWithContext();

    const scaleDropdown = screen.getByRole('combobox', { name: 'Scale' });
    scaleDropdown.click();
    expect(scaleDropdown).toHaveAttribute('aria-labelledby', 'scale-dropdown-label');

    const deleteScaleButton = screen.getByLabelText('Delete 1.0 in = 1.0 in');
    expect(deleteScaleButton).toHaveClass('delete', { exact: true });
  });

  it('renders multiple scales from the scales map', () => {
    currentCore = createCoreMock({
      '1 in = 1 in': [{}],
      '1 cm = 25 cm': [{}],
    });
    useCore.mockReturnValue({ core: currentCore });

    customRenderWithContext();

    const scaleDropdown = screen.getByRole('combobox', { name: 'Scale' });
    scaleDropdown.click();

    const deleteButtons = screen.getAllByLabelText(/Delete/);
    expect(deleteButtons).toHaveLength(2);
  });

  it('updates scales when the core instance changes', () => {
    const { rerender } = customRenderWithContext();

    const scaleDropdown = screen.getByRole('combobox', { name: 'Scale' });
    scaleDropdown.click();

    let deleteButtons = screen.getAllByLabelText(/Delete/);
    expect(deleteButtons).toHaveLength(1);

    currentCore = createCoreMock({
      '1 in = 1 in': [{}],
      '1 cm = 25 cm': [{}],
    });
    useCore.mockReturnValue({ core: currentCore });

    rerender(
      <Provider store={createStore()}>
        <ScaleOverlayContainer {...props} />
      </Provider>,
    );

    deleteButtons = screen.getAllByLabelText(/Delete/);
    expect(deleteButtons).toHaveLength(2);
  });

  it('disables delete when any measurement is not modifiable', () => {
    const annotation = new window.Core.Annotations.Annotation();
    annotation.PageNumber = 1;
    currentCore = createCoreMock({
      '1 in = 1 in': [annotation],
    }, { canModify: false });
    useCore.mockReturnValue({ core: currentCore });

    customRenderWithContext();

    const scaleDropdown = screen.getByRole('combobox', { name: 'Scale' });
    scaleDropdown.click();

    const deleteScaleButton = screen.getByLabelText('Delete 1.0 in = 1.0 in');
    expect(deleteScaleButton).toBeDisabled();
  });

  it('does not skip scales with empty measurement data', () => {
    const annotation = new window.Core.Annotations.Annotation();
    annotation.PageNumber = 1;
    currentCore = createCoreMock({
      '1 in = 1 in': [],
      '1 cm = 25 cm': [annotation],
    });
    useCore.mockReturnValue({ core: currentCore });

    customRenderWithContext();

    const scaleDropdown = screen.getByRole('combobox', { name: 'Scale' });
    scaleDropdown.click();

    const deleteButtons = screen.getAllByLabelText(/Delete/);
    expect(deleteButtons).toHaveLength(2);
  });

  it('shows add new scale in dropdown when multiple scales mode is enabled', () => {
    currentCore = createCoreMock({
      '1 in = 1 in': [{}],
    });
    useCore.mockReturnValue({ core: currentCore });

    customRenderWithContext({ viewer: { isMultipleScalesMode: true } });

    const scaleDropdown = screen.getByRole('combobox', { name: 'Scale' });
    scaleDropdown.click();

    const addNewScaleButton = screen.getByText(/Add New Scale/i);
    expect(addNewScaleButton).toBeInTheDocument();
  });

  it('updates delete button disabled state when core permissions change', () => {
    const annotation = new window.Core.Annotations.Annotation();
    annotation.PageNumber = 1;
    currentCore = createCoreMock({
      '1 in = 1 in': [annotation],
      '1 cm = 25 cm': [annotation],
    }, { canModify: false });
    useCore.mockReturnValue({ core: currentCore });

    const { rerender } = customRenderWithContext();

    const scaleDropdown = screen.getByRole('combobox', { name: 'Scale' });
    scaleDropdown.click();

    let deleteScaleButton = screen.getByLabelText('Delete 1.0 in = 1.0 in');
    expect(deleteScaleButton).toBeDisabled();

    currentCore = createCoreMock({
      '1 in = 1 in': [annotation],
      '1 cm = 25 cm': [annotation],
    }, { canModify: true });
    useCore.mockReturnValue({ core: currentCore });

    rerender(
      <Provider store={createStore()}>
        <ScaleOverlayContainer {...props} />
      </Provider>,
    );

    deleteScaleButton = screen.getByLabelText('Delete 1.0 in = 1.0 in');
    expect(deleteScaleButton).not.toBeDisabled();
  });

  describe('Measurement Page Value Rounding', () => {
    // The page value is the only part of the title affected by isMeasurementPageValueRoundingEnabled
    const scaleCases = [
      {
        name: 'decimal scale',
        scaleKey: '1.26 in = 1 ft',
        precision: 0.1,
        roundedTitle: '1.3 in = 1.0 ft',
        unroundedTitle: '1.26 in = 1.0 ft',
      },
      {
        name: 'fractional scale',
        scaleKey: '1.3 in = 1 in',
        precision: 1 / 16,
        roundedTitle: '1 5/16" = 1"',
        unroundedTitle: '1 19/64" = 1"',
      },
    ];

    const openScaleDropdown = () => {
      screen.getByRole('combobox', { name: 'Scale' }).click();
    };

    describe.each(scaleCases)('$name', ({ scaleKey, precision, roundedTitle, unroundedTitle }) => {
      beforeEach(() => {
        currentCore = createCoreMock({ [scaleKey]: [{}] });
        currentCore.getScalePrecision.mockReturnValue(precision);
        useCore.mockReturnValue({ core: currentCore });
      });

      it('rounds the page value when isMeasurementPageValueRoundingEnabled is true', () => {
        customRenderWithContext({ viewer: { isMeasurementPageValueRoundingEnabled: true } });
        openScaleDropdown();

        expect(screen.getByLabelText(`Delete ${roundedTitle}`)).toBeInTheDocument();
        expect(screen.queryByLabelText(`Delete ${unroundedTitle}`)).not.toBeInTheDocument();
      });

      it('does not round the page value when isMeasurementPageValueRoundingEnabled is false', () => {
        customRenderWithContext({ viewer: { isMeasurementPageValueRoundingEnabled: false } });
        openScaleDropdown();

        expect(screen.getByLabelText(`Delete ${unroundedTitle}`)).toBeInTheDocument();
        expect(screen.queryByLabelText(`Delete ${roundedTitle}`)).not.toBeInTheDocument();
      });

      it('updates the scale title when isMeasurementPageValueRoundingEnabled changes', () => {
        const { rerender } = customRenderWithContext({ viewer: { isMeasurementPageValueRoundingEnabled: true } });
        openScaleDropdown();
        expect(screen.getByLabelText(`Delete ${roundedTitle}`)).toBeInTheDocument();

        rerender(
          <Provider store={createStore({ viewer: { isMeasurementPageValueRoundingEnabled: false } })}>
            <ScaleOverlayContainer {...props} />
          </Provider>,
        );

        expect(screen.getByLabelText(`Delete ${unroundedTitle}`)).toBeInTheDocument();
        expect(screen.queryByLabelText(`Delete ${roundedTitle}`)).not.toBeInTheDocument();
      });
    });
  });
});
