import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import DataElementWrapper from './DataElementWrapper';

describe('DataElementWrapper', () => {
  it('Should not throw error without props', () => {
    expect(() => {
      render(<DataElementWrapper />);
    }).not.toThrow();
  });

  it('Should render children to dom', () => {
    const { getByText } = render(
      <DataElementWrapper>
        <div>Children</div>
      </DataElementWrapper>,
    );
    const childText = getByText('Children');
    expect(childText).toBeInTheDocument();
  });

  it('Should render button if type is set to "button"', () => {
    const buttonText = 'HelloUnitTest';
    const { container } = render(<DataElementWrapper type="button">{buttonText}</DataElementWrapper>);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(buttonText);
  });
  it('Should pass props correctly to div element', () => {
    const { container } = render(<DataElementWrapper x-unit-test="x-unit-test-value">Child</DataElementWrapper>);
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('x-unit-test', 'x-unit-test-value');
  });
  it('Should pass props correctly to button element', () => {
    const { container } = render(
      <DataElementWrapper type="button" x-unit-test-button="x-unit-test-button-value">
        Child
      </DataElementWrapper>,
    );
    const element = container.querySelector('button');
    expect(element).toHaveAttribute('x-unit-test-button', 'x-unit-test-button-value');
  });

  it('Should set data-element attribute for div', () => {
    const dataElement = 'unit-test-data-element';
    const { container } = render(<DataElementWrapper dataElement={dataElement}>Child</DataElementWrapper>);
    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('data-element', dataElement);
  });

  it('Should set data-element attribute for button', () => {
    const dataElement = 'unit-test-data-element';
    const { container } = render(
      <DataElementWrapper type="button" dataElement={dataElement}>
        Child
      </DataElementWrapper>,
    );
    const element = container.querySelector('button');
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('data-element', dataElement);
  });

  it('Forward ref should be assigned', () => {
    const dataElement = 'unit-test-with-ref';
    let myRef;
    function UnitTestRefComponentWrapper() {
      myRef = React.useRef();
      return (<DataElementWrapper ref={myRef} dataElement={dataElement}>Child</DataElementWrapper>);
    }

    render(<UnitTestRefComponentWrapper />);
    expect(myRef.current).toBeDefined();
    expect(myRef.current).toHaveAttribute('data-element', dataElement);
  });

  it('Should display element if not disabled in redux store', () => {
    const initialState = {
      viewer: {
        disabledElements: { 'unit-test': { disabled: false } },
      },
    };
    function rootReducer(state = initialState, action) { // eslint-disable-line no-unused-vars
      return state;
    }
    const store = createStore(rootReducer);
    const { container } = render(
      <Provider store={store}>
        <DataElementWrapper dataElement="unit-test">Child</DataElementWrapper>
      </Provider>
    );
    expect(container.querySelector('div[data-element="unit-test"]')).toBeInTheDocument();
  });
  it('Should not display element if element disabled in redux store', () => {
    const initialState = {
      viewer: {
        disabledElements: { 'unit-test': { disabled: true } },
      },
    };
    function rootReducer(state = initialState, action) { // eslint-disable-line no-unused-vars
      return state;
    }
    const store = createStore(rootReducer);
    const { container } = render(
      <Provider store={store}>
        <DataElementWrapper dataElement="unit-test">Child</DataElementWrapper>
      </Provider>
    );
    expect(container.querySelector('div[data-element="unit-test"]')).not.toBeInTheDocument();
  });
});
