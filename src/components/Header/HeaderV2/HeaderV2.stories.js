import React from 'react';
import HeaderV2 from './HeaderV2';
import initialState from 'src/redux/initialState';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';


export default {
  title: 'Components/HeaderV2',
  component: HeaderV2,
};

const store = configureStore({
  reducer: () => initialState
});

const BasicComponent = (props) => {
  return (
    <Provider store={store}>
      <HeaderV2 {...props} />
    </Provider>
  );
};


export const DefaultHeader = BasicComponent.bind({});