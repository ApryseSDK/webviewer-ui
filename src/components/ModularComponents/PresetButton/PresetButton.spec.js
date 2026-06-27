import React from 'react';
import PresetButton from './PresetButton';
import createPresetButtonAPI from 'src/apis/ModularComponents/presetButton';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import { render, screen } from '@testing-library/react';
import selectors from 'selectors';

const StoreConnectedPresetButton = ({ dataElement }) => {
  const component = useSelector((state) => selectors.getModularComponent(state, dataElement));
  if (!component) {
    return null;
  }
  return <PresetButton {...component} />;
};

describe('PresetButton', () => {
  const dataElement = 'settingsPresetButton';

  it('should apply initial style', () => {
    const store = configureStore({ reducer: rootReducer() });
    render(
      <Provider store={store}>
        <PresetButton
          dataElement={dataElement}
          buttonType="settingsButton"
          style={{ background: 'red' }}
        />
      </Provider>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ background: 'red' });
  });

  it('should update style when setStyle is called', () => {
    const store = configureStore({ reducer: rootReducer() });
    const createPresetButton = createPresetButtonAPI(store);

    const presetButton = createPresetButton({
      dataElement,
      buttonType: 'settingsButton',
      style: { background: 'red' },
    });

    store.dispatch({
      type: 'ADD_MODULAR_HEADERS_AND_COMPONENTS',
      payload: {
        headersMap: {},
        componentsMap: {
          [dataElement]: {
            dataElement,
            type: presetButton.type,
            buttonType: presetButton.buttonType,
            style: presetButton.style,
          },
        },
      },
    });

    render(
      <Provider store={store}>
        <StoreConnectedPresetButton dataElement={dataElement} />
      </Provider>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ background: 'red' });

    presetButton.setStyle({ background: 'blue' });
    expect(button).toHaveStyle({ background: 'blue' });
  });
});
