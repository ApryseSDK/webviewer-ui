import React from 'react';
import Header from './Header';
import initialState from 'src/redux/initialState';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';


export default {
  title: 'Components/Header',
  component: Header,
};

const store = configureStore({
  reducer: () => initialState
});

const BasicComponent = (props) => {
  return (
    <Provider store={store}>
      <Header {...props} />
    </Provider>
  );
};


export const DefaultHeader = BasicComponent.bind({});
DefaultHeader.args = {
  isToolsHeaderOpen: true,
  isMultiTab: true,
};