import React from 'react';
import ToolButton from './ToolButton';
import createToolButtonAPI from 'src/apis/ModularComponents/toolButton';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import { render, screen } from '@testing-library/react';
import selectors from 'selectors';

const StoreConnectedToolButton = ({ dataElement }) => {
  const component = useSelector((state) => selectors.getModularComponent(state, dataElement));
  if (!component) {
    return null;
  }
  return <ToolButton {...component} />;
};

describe('ToolButton', () => {
  const dataElement = 'panToolButton';
  const toolName = 'Pan';

  it('should apply initial style', () => {
    const store = configureStore({ reducer: rootReducer() });
    render(
      <Provider store={store}>
        <ToolButton
          dataElement={dataElement}
          toolName={toolName}
          label="Pan"
          img="icon-header-pan"
          buttonStyle={{ background: 'red' }}
        />
      </Provider>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ background: 'red' });
  });

  it('should update style when setStyle is called', () => {
    const store = configureStore({ reducer: rootReducer() });
    const createToolButton = createToolButtonAPI(store);

    const toolButton = createToolButton({
      dataElement,
      toolName,
      label: 'Pan',
      img: 'icon-header-pan',
      style: { background: 'red' },
    });

    store.dispatch({
      type: 'ADD_MODULAR_HEADERS_AND_COMPONENTS',
      payload: {
        headersMap: {},
        componentsMap: {
          [dataElement]: {
            dataElement,
            type: toolButton.type,
            toolName: toolButton.toolName,
            label: toolButton.label,
            img: toolButton.img,
            style: toolButton.style,
          },
        },
      },
    });

    render(
      <Provider store={store}>
        <StoreConnectedToolButton dataElement={dataElement} />
      </Provider>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ background: 'red' });

    toolButton.setStyle({ background: 'blue' });
    expect(button).toHaveStyle({ background: 'blue' });
  });
});
