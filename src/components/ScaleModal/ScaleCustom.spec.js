import React from 'react';
import { render, screen, within } from '@testing-library/react';
import ScaleCustom from './ScaleCustom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import userEvent from '@testing-library/user-event';

describe('ScaleCustom', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer(),
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    });
  });

  afterEach(() => {
    store = null;
  });

  it('renders the component', () => {
    const props = {
      scale: [[1, 'in'], [1, 'in']],
      onScaleChange: jest.fn(),
      precision: 0.1,
    };
    const { container } = render(
      <Provider store={store}>
        <ScaleCustom {...props} />
      </Provider>
    );
    const scaleCustomElement = container.querySelector('.custom-scale-container');
    expect(scaleCustomElement).toBeInTheDocument();
  });

  it('triggers onScaleChange with didPageScaleChange true when page value changes', () => {
    const onScaleChangeMock = jest.fn();
    const props = {
      scale: [[1, 'in'], [1, 'in']],
      onScaleChange: onScaleChangeMock,
      precision: 0.1,
    };
    render(
      <Provider store={store}>
        <ScaleCustom {...props} />
      </Provider>
    );

    const pageScaleInput = screen.getByRole('spinbutton', { name: 'Paper Units' });
    userEvent.type(pageScaleInput, '2');

    expect(onScaleChangeMock).toHaveBeenCalledWith(expect.any(Object), { didPageScaleChange: true });
  });

  it('triggers onScaleChange with didPageScaleChange true when page unit changes', () => {
    const onScaleChangeMock = jest.fn();
    const props = {
      scale: [[1, 'in'], [1, 'in']],
      onScaleChange: onScaleChangeMock,
      precision: 0.1,
    };
    render(
      <Provider store={store}>
        <ScaleCustom {...props} />
      </Provider>
    );

    const pageUnitInput = screen.getByRole('combobox', { name: 'Paper Units' });
    userEvent.click(pageUnitInput);
    const dropdown = screen.getByRole('group', { name: 'Paper Units' });
    const mmOption = within(dropdown).getByRole('option', { name: 'mm' });
    userEvent.click(mmOption);

    expect(onScaleChangeMock).toHaveBeenCalledWith(expect.any(Object), { didPageScaleChange: true });
  });

  it('triggers onScaleChange with didPageScaleChange false when only world value changes', () => {
    const onScaleChangeMock = jest.fn();
    const props = {
      scale: [[1, 'in'], [1, 'in']],
      onScaleChange: onScaleChangeMock,
      precision: 0.1,
    };
    render(
      <Provider store={store}>
        <ScaleCustom {...props} />
      </Provider>
    );

    const worldScaleInput = screen.getByRole('spinbutton', { name: 'Display Units' });
    userEvent.type(worldScaleInput, '2');

    expect(onScaleChangeMock).toHaveBeenCalledWith(expect.any(Object), { didPageScaleChange: false });
  });

  it('triggers onScaleChange with didPageScaleChange false when only world unit changes', () => {
    const onScaleChangeMock = jest.fn();
    const props = {
      scale: [[1, 'in'], [1, 'in']],
      onScaleChange: onScaleChangeMock,
      precision: 0.1,
    };
    render(
      <Provider store={store}>
        <ScaleCustom {...props} />
      </Provider>
    );

    const worldScaleInput = screen.getByRole('spinbutton', { name: 'Display Units' });
    userEvent.click(worldScaleInput);
    const dropdown = screen.getByRole('group', { name: 'Display Units' });
    const mmOption = within(dropdown).getByRole('option', { name: 'mm' });
    userEvent.click(mmOption);

    expect(onScaleChangeMock).toHaveBeenCalledWith(expect.any(Object), { didPageScaleChange: false });
  });
});