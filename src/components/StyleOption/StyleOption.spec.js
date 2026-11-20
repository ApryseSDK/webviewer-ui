import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import StyleOption from './StyleOption';

describe('StyleOption', () => {
  it('should render nothing when no properties are given', () => {
    const { container } = render(<StyleOption onLineStyleChange={jest.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render nothing when properties do not include StrokeStyle', () => {
    const { container } = render(
      <StyleOption onLineStyleChange={jest.fn()} properties={{ Color: 'red' }} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should render the dropdown when properties include StrokeStyle', () => {
    const store = configureStore({ reducer: rootReducer() });
    const { getByRole } = render(
      <Provider store={store}>
        <StyleOption onLineStyleChange={jest.fn()} properties={{ StrokeStyle: 'dashed' }} />
      </Provider>
    );
    expect(getByRole('combobox')).toBeInTheDocument();
  });

  it('should not throw a hook-order error when a mounted instance goes from having StrokeStyle to not having it', () => {
    const store = configureStore({ reducer: rootReducer() });
    const { queryByRole, rerender } = render(
      <Provider store={store}>
        <StyleOption onLineStyleChange={jest.fn()} properties={{ StrokeStyle: 'dashed' }} />
      </Provider>
    );
    expect(queryByRole('combobox')).toBeInTheDocument();

    expect(() => {
      rerender(
        <Provider store={store}>
          <StyleOption onLineStyleChange={jest.fn()} properties={{ Color: 'red' }} />
        </Provider>
      );
    }).not.toThrow();

    expect(queryByRole('combobox')).not.toBeInTheDocument();
  });
});
