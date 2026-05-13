import React from 'react';
import CustomButton from './CustomButton';
import createCustomButtonAPI from 'src/apis/ModularComponents/customButton';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import { render, screen } from '@testing-library/react';
import selectors from 'selectors';

/**
 * A wrapper that reads a modular component's props from the Redux store
 * and renders CustomButton, so it re-renders when setStyle updates the store.
 * @ignore
 */
const StoreConnectedCustomButton = ({ dataElement }) => {
  const component = useSelector((state) => selectors.getModularComponent(state, dataElement));
  if (!component) {
    return null;
  }
  return <CustomButton {...component} />;
};

describe('CustomButton', () => {
  it('should apply initial style to the button', () => {
    const store = configureStore({ reducer: rootReducer });

    render(
      <Provider store={store}>
        <CustomButton
          dataElement="customButton1"
          title="customButton1"
          label="customButton1"
          img="icon-header-annotation-line"
          className="custom-button-class"
          style={{
            background: 'red',
            color: 'white',
          }}
        />
      </Provider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ background: 'red', color: 'white' });
  });

  it('should update the rendered button style when setStyle is called', () => {
    const store = configureStore({ reducer: rootReducer });
    const createButton = createCustomButtonAPI(store);

    // Create the component via API
    const dataElement = 'customButton1';
    const customButton = createButton({
      dataElement: dataElement,
      title: dataElement,
      label: dataElement,
      img: 'icon-header-annotation-line',
      style: { background: 'red' },
    });

    // Populate the component in the Redux store so our wrapper can read it
    store.dispatch({
      type: 'ADD_MODULAR_HEADERS_AND_COMPONENTS',
      payload: {
        headersMap: {},
        componentsMap: {
          customButton1: {
            dataElement,
            type: customButton.type,
            title: customButton.title,
            label: customButton.label,
            img: customButton.img,
            style: customButton.style,
          },
        },
      },
    });

    render(
      <Provider store={store}>
        <StoreConnectedCustomButton dataElement={dataElement} />
      </Provider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ background: 'red' });

    // Call setStyle on the API object — dispatches to Redux, updates existing component entry, and triggers re-render
    customButton.setStyle({ background: 'blue' });
    expect(button).toHaveStyle({ background: 'blue' });
  });
});