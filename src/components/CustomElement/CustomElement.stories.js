import React from 'react';
import CustomElement from './CustomElement';
import { Provider } from 'react-redux';
import rootReducer from 'reducers/rootReducer';
import { configureStore } from '@reduxjs/toolkit';

export default {
  title: 'ModularComponents/CustomElement',
  component: CustomElement,
};

const store = configureStore({ reducer: rootReducer });

const defaultProps = {
  dataElement: 'test',
  className: 'CustomElement'
};

const ReactElement = () => {
  return <div style={{ backgroundColor: 'darkgray', color: 'white', textAlign: 'center' }}>Test React Component</div>;
};

const renderDiv = () => {
  const element = document.createElement('div');
  element.style.backgroundColor = 'darkgrey';
  element.style.color = 'white';
  element.style.textAlign = 'center';
  element.innerText = 'Test HTML Element';
  return element;
};

const failedTestDiv = () => {
  const element = document.createElement('div');
  element.style.backgroundColor = 'red';
  element.style.color = 'white';
  element.style.textAlign = 'center';
  element.innerText = 'Failed Test';
  return element;
};

export const CustomElementReact = () => (
  <Provider store={store}>
    <CustomElement {...defaultProps} render={() => <ReactElement/>}/>
  </Provider>
);

export const CustomElementHTML = () => (
  <Provider store={store}>
    <CustomElement {...defaultProps} render={renderDiv}/>
  </Provider>
);

export const CustomElementWithRenderArguments = () => (
  <Provider store={store}>
    <CustomElement {...defaultProps} render={(arg) => arg ? <ReactElement/> : failedTestDiv()}
      renderArguments={[true]}/>
  </Provider>
);