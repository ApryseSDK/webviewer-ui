import React from 'react';
import RibbonItem from './RibbonItem';
import createRibbonItemAPI from 'src/apis/ModularComponents/ribbonItem';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import { render, screen } from '@testing-library/react';
import selectors from 'selectors';

const StoreConnectedRibbonItem = ({ dataElement }) => {
  const component = useSelector((state) => selectors.getModularComponent(state, dataElement));
  if (!component) {
    return null;
  }
  return <RibbonItem {...component} />;
};

describe('RibbonItem', () => {
  const dataElement = 'ribbon1';

  it('should apply initial style', () => {
    const store = configureStore({ reducer: rootReducer });
    render(
      <Provider store={store}>
        <RibbonItem
          dataElement={dataElement}
          label="Test Ribbon"
          groupedItems={[]}
          style={{ backgroundColor: 'red' }}
        />
      </Provider>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ backgroundColor: 'red' });
  });

  it('should update style when setStyle is called', () => {
    const store = configureStore({ reducer: rootReducer });
    const createRibbonItem = createRibbonItemAPI(store);

    const ribbonItem = createRibbonItem({
      dataElement,
      label: 'Test Ribbon',
      toolbarGroup: 'toolbarGroup-Test',
      groupedItems: [],
      style: { backgroundColor: 'red' },
    });

    store.dispatch({
      type: 'ADD_MODULAR_HEADERS_AND_COMPONENTS',
      payload: {
        headersMap: {},
        componentsMap: {
          [dataElement]: {
            dataElement,
            type: ribbonItem.type,
            label: ribbonItem.label,
            toolbarGroup: ribbonItem.toolbarGroup,
            groupedItems: ribbonItem.groupedItems,
            style: ribbonItem.style,
          },
        },
      },
    });

    render(
      <Provider store={store}>
        <StoreConnectedRibbonItem dataElement={dataElement} />
      </Provider>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ backgroundColor: 'red' });

    ribbonItem.setStyle({ backgroundColor: 'blue' });
    expect(button).toHaveStyle({ backgroundColor: 'blue' });
  });
});
