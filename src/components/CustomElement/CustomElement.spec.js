import React from 'react';
import CustomElement from './CustomElement';
import createCustomElementAPI from 'src/apis/ModularComponents/customElement';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import { render } from '@testing-library/react';
import selectors from 'selectors';

const StoreConnectedCustomElement = ({ dataElement }) => {
  const component = useSelector((state) => selectors.getModularComponent(state, dataElement));
  if (!component) {
    return null;
  }
  return <CustomElement {...component} />;
};

describe('CustomElement', () => {
  const dataElement = 'myCustomElement';
  const renderFn = () => document.createElement('div');

  it('should apply initial style', () => {
    const store = configureStore({ reducer: rootReducer });
    const { container } = render(
      <Provider store={store}>
        <CustomElement
          dataElement={dataElement}
          render={renderFn}
          style={{ background: 'red' }}
        />
      </Provider>
    );
    const el = container.querySelector(`[data-element="${dataElement}"]`);
    expect(el).toHaveStyle({ background: 'red' });
  });

  it('should update style when setStyle is called', () => {
    const store = configureStore({ reducer: rootReducer });
    const createElement = createCustomElementAPI(store);

    const customElement = createElement({
      dataElement,
      render: renderFn,
      style: { background: 'red' },
    });

    store.dispatch({
      type: 'ADD_MODULAR_HEADERS_AND_COMPONENTS',
      payload: {
        headersMap: {},
        componentsMap: {
          [dataElement]: {
            dataElement,
            type: customElement.type,
            render: customElement.render,
            style: customElement.style,
          },
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <StoreConnectedCustomElement dataElement={dataElement} />
      </Provider>
    );
    const el = container.querySelector(`[data-element="${dataElement}"]`);
    expect(el).toHaveStyle({ background: 'red' });

    customElement.setStyle({ background: 'blue' });
    expect(el).toHaveStyle({ background: 'blue' });
  });
});
