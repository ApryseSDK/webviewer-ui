import React from 'react';
import Divider from './Divider';
import createDividerAPI from 'src/apis/ModularComponents/divider';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import { render } from '@testing-library/react';
import selectors from 'selectors';

const StoreConnectedDivider = ({ dataElement }) => {
  const component = useSelector((state) => selectors.getModularComponent(state, dataElement));
  if (!component) {
    return null;
  }
  return <Divider {...component} />;
};

describe('Divider', () => {
  const dataElement = 'divider1';

  it('should apply initial style', () => {
    const store = configureStore({ reducer: rootReducer() });
    const { container } = render(
      <Provider store={store}>
        <Divider
          dataElement={dataElement}
          style={{ color: 'pink' }}
        />
      </Provider>
    );
    const el = container.querySelector(`[data-element="${dataElement}"]`);
    expect(el).toHaveStyle({ color: 'pink' });
  });

  it('should update style when setStyle is called', () => {
    const store = configureStore({ reducer: rootReducer() });
    const createDivider = createDividerAPI(store);

    const divider = createDivider({
      dataElement,
      style: { color: 'pink' },
    });

    store.dispatch({
      type: 'ADD_MODULAR_HEADERS_AND_COMPONENTS',
      payload: {
        headersMap: {},
        componentsMap: {
          [dataElement]: {
            dataElement,
            type: divider.type,
            style: divider.style,
          },
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <StoreConnectedDivider dataElement={dataElement} />
      </Provider>
    );
    const el = container.querySelector(`[data-element="${dataElement}"]`);
    expect(el).toHaveStyle({ color: 'pink' });

    divider.setStyle({ color: 'red' });
    expect(el).toHaveStyle({ color: 'red' });
  });
});
