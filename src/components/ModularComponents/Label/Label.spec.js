import React from 'react';
import Label from './Label';
import createLabelAPI from 'src/apis/ModularComponents/label';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import { render } from '@testing-library/react';
import selectors from 'selectors';

const StoreConnectedLabel = ({ dataElement }) => {
  const component = useSelector((state) => selectors.getModularComponent(state, dataElement));
  if (!component) {
    return null;
  }
  return <Label {...component}/>;
};

describe('Label', () => {
  const dataElement = 'custom-label';

  it('should apply initial style', () => {
    const store = configureStore({ reducer: rootReducer() });
    const { container } = render(
      <Provider store={store}>
        <Label
          dataElement={dataElement}
          label="Custom Label"
          style={{ color: 'black' }}
        />
      </Provider>
    );
    const el = container.querySelector(`[data-element="${dataElement}"]`);
    expect(el).toHaveStyle({ color: 'black' });
  });

  it('should update style when setStyle is called', () => {
    const store = configureStore({ reducer: rootReducer() });
    const createLabel = createLabelAPI(store);

    const label = createLabel({
      dataElement,
      label: 'Custom Label',
      style: { color: 'black' },
    });

    store.dispatch({
      type: 'ADD_MODULAR_HEADERS_AND_COMPONENTS',
      payload: {
        headersMap: {},
        componentsMap: {
          [dataElement]: {
            dataElement,
            type: label.type,
            label: label.label,
            style: label.style,
          },
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <StoreConnectedLabel dataElement={dataElement} />
      </Provider>
    );
    const el = container.querySelector(`[data-element="${dataElement}"]`);
    expect(el).toHaveStyle({ color: 'black' });

    label.setStyle({ color: 'green' });
    expect(el).toHaveStyle({ color: 'green' });
  });
});
