import React from 'react';
import ToggleElementButton from './ToggleElementButton';
import createToggleElementButtonAPI from 'src/apis/ModularComponents/toggleElementButton';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import { render, screen } from '@testing-library/react';
import selectors from 'selectors';

const StoreConnectedToggleElementButton = ({ dataElement }) => {
  const component = useSelector((state) => selectors.getModularComponent(state, dataElement));
  if (!component) {
    return null;
  }
  return <ToggleElementButton {...component} />;
};

describe('ToggleElementButton', () => {
  const dataElement = 'myToggleButton';

  it('should apply initial style', () => {
    const store = configureStore({ reducer: rootReducer() });
    render(
      <Provider store={store}>
        <ToggleElementButton
          dataElement={dataElement}
          title="Toggle"
          img="icon-save"
          toggleElement="somePanel"
          style={{ background: 'red' }}
        />
      </Provider>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ background: 'red' });
  });

  it('should update style when setStyle is called', () => {
    const store = configureStore({ reducer: rootReducer() });
    const createToggleButton = createToggleElementButtonAPI(store);

    const toggleButton = createToggleButton({
      dataElement,
      title: 'Toggle',
      img: 'icon-save',
      toggleElement: 'somePanel',
      style: { background: 'red' },
    });

    store.dispatch({
      type: 'ADD_MODULAR_HEADERS_AND_COMPONENTS',
      payload: {
        headersMap: {},
        componentsMap: {
          [dataElement]: {
            dataElement,
            type: toggleButton.type,
            title: toggleButton.title,
            img: toggleButton.img,
            toggleElement: toggleButton.toggleElement,
            style: toggleButton.style,
          },
        },
      },
    });

    render(
      <Provider store={store}>
        <StoreConnectedToggleElementButton dataElement={dataElement} />
      </Provider>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ background: 'red' });

    toggleButton.setStyle({ background: 'blue' });
    expect(button).toHaveStyle({ background: 'blue' });
  });
});
