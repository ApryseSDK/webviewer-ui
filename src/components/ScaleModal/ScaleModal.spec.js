import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getDOMActiveElement } from 'src/helpers/webComponent';
import { Provider } from 'react-redux';
import ScaleModal from './ScaleModal';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import useCore from 'hooks/useCore';
import actions from 'actions';
import DataElements from 'constants/dataElement';

jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const createCoreMock = () => ({
  getScales: jest.fn(() => ({})),
  getScalePrecision: jest.fn(() => 0.1),
  setToolMode: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  createAndApplyScale: jest.fn(),
  replaceScales: jest.fn(),
});

describe('Scale Modal Component', () => {
  let store;
  let coreMock;

  beforeEach(() => {
    coreMock = createCoreMock();
    useCore.mockReturnValue({ core: coreMock });

    store = configureStore({
      reducer: rootReducer(),
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    });
    store.dispatch(actions.openElements([DataElements.SCALE_MODAL]));
    store.dispatch(actions.setIsElementHidden(DataElements.SCALE_MODAL, false));
    store.dispatch(actions.setIsAddingNewScale(true));
  });

  afterEach(() => {
    jest.clearAllMocks();
    store = null;
  });

  it('renders correctly and has appropriate accessibility labels', () => {
    render(
      <Provider store={store}>
        <ScaleModal />
      </Provider>
    );

    const pageUnitInput = screen.getByRole('spinbutton', { name: 'Paper Units' });
    const worldUnitInput = screen.getByRole('spinbutton', { name: 'Display Units' });
    const precisionDropdown = screen.getByRole('combobox', { name: 'Precision:' });
    const paperUnitsDropdown = screen.getByRole('combobox', { name: 'Paper Units' });
    const displayUnitsDropdown = screen.getByRole('combobox', { name: 'Display Units' });
    expect(pageUnitInput).toBeInTheDocument();
    expect(worldUnitInput).toBeInTheDocument();
    expect(precisionDropdown).toBeInTheDocument();
    expect(paperUnitsDropdown).toBeInTheDocument();
    expect(displayUnitsDropdown).toBeInTheDocument();
  });

  it('does not round page scale when creating a new scale if the page scale was created using calibration', async () => {
    const props = {
      annotations: [],
      selectedTool: null,
    };
    render(
      <Provider store={store}>
        <ScaleModal {...props} />
      </Provider>
    );
    const calibrationButton = screen.getByRole('button', { name: 'Calibrate' });
    userEvent.click(calibrationButton);
    store.dispatch(actions.updateCalibrationInfo({
      isCalibration: false,
      tempScale: '1.234567 in = 10.34 mm',
      isFractionalUnit: false,
    }));

    // End the calibration process by reopening the scale modal
    store.dispatch(actions.setIsElementHidden(DataElements.SCALE_MODAL, false));
    const createButton = screen.getByRole('button', { name: 'Create' });
    userEvent.click(createButton);

    expect(coreMock.createAndApplyScale).toHaveBeenCalled();
    const createdScale = coreMock.createAndApplyScale.mock.calls[0][0];
    const [[pageValue, pageUnit], [worldValue, worldUnit]] = createdScale.getScaleRatioAsArray();
    expect(pageValue).toBe(1.234567);
    expect(pageUnit).toBe('in');
    expect(worldValue).toBe(10.3);
    expect(worldUnit).toBe('mm');
  });

  it('rounds page scale to the default precision 0.1 when creating a new scale if the page scale was created manually by user', async () => {
    const props = {
      annotations: [],
      selectedTool: null,
    };
    render(
      <Provider store={store}>
        <ScaleModal {...props} />
      </Provider>
    );
    const pageValueInput = screen.getByRole('spinbutton', { name: 'Paper Units' });
    userEvent.clear(pageValueInput);
    userEvent.type(pageValueInput, '2.345678');
    const createButton = screen.getByRole('button', { name: 'Create' });
    userEvent.click(createButton);

    expect(coreMock.createAndApplyScale).toHaveBeenCalled();
    const createdScale = coreMock.createAndApplyScale.mock.calls[0][0];
    const [[pageValue, pageUnit]] = createdScale.getScaleRatioAsArray();
    expect(pageValue).toBe(2.3);
    expect(pageUnit).toBe('in');
  });

  it('rounds page scale when creating a new scale even if the previous page scale was created using calibration', async () => {
    const props = {
      annotations: [],
      selectedTool: null,
    };
    const { rerender } = render(
      <Provider store={store}>
        <ScaleModal {...props} />
      </Provider>
    );
    const calibrationButton = screen.getByRole('button', { name: 'Calibrate' });
    userEvent.click(calibrationButton);
    store.dispatch(actions.updateCalibrationInfo({
      isCalibration: false,
      tempScale: '1.234567 in = 10.34 mm',
      isFractionalUnit: false,
    }));

    // End the calibration process by reopening the scale modal
    store.dispatch(actions.setIsElementHidden(DataElements.SCALE_MODAL, false));
    const createButton = screen.getByRole('button', { name: 'Create' });
    userEvent.click(createButton);

    expect(coreMock.createAndApplyScale).toHaveBeenCalled();
    const createdScale = coreMock.createAndApplyScale.mock.calls[0][0];
    const [[pageValue, pageUnit], [worldValue, worldUnit]] = createdScale.getScaleRatioAsArray();
    expect(pageValue).toBe(1.234567);
    expect(pageUnit).toBe('in');
    expect(worldValue).toBe(10.3);
    expect(worldUnit).toBe('mm');

    // Rerender the scale modal and create another scale without calibration
    rerender(
      <Provider store={store}>
        <ScaleModal {...props} />
      </Provider>
    );
    const pageValueInput = screen.getByRole('spinbutton', { name: 'Paper Units' });
    userEvent.clear(pageValueInput);
    userEvent.type(pageValueInput, '2.345678');
    userEvent.click(createButton);

    expect(coreMock.createAndApplyScale).toHaveBeenCalledTimes(2);
    const secondCreatedScale = coreMock.createAndApplyScale.mock.calls[1][0];
    const [[secondPageValue, secondPageUnit]] = secondCreatedScale.getScaleRatioAsArray();
    expect(secondPageValue).toBe(2.3);
    expect(secondPageUnit).toBe('in');
  });

  it('keeps typed custom scale value while focused and updates after blur', async () => {
    const props = {
      annotations: [],
      selectedTool: null,
    };
    const { container } = render(
      <Provider store={store}>
        <ScaleModal {...props} />
      </Provider>
    );

    const pageScaleInput = container.querySelector('[data-element="customPageScaleValue"]');
    expect(pageScaleInput).toBeTruthy();

    userEvent.clear(pageScaleInput);
    await userEvent.type(pageScaleInput, '11.56');

    expect(pageScaleInput).toHaveValue(11.56);
    expect(pageScaleInput).toBe(getDOMActiveElement());

    userEvent.tab();

    await waitFor(() => {
      expect(pageScaleInput).not.toBe(getDOMActiveElement());
      expect(pageScaleInput).toHaveValue(11.6);
    });
  });
});