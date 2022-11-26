import React from 'react';
import CustomHeader from './CustomHeader';
import initialState from 'src/redux/initialState';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';


export default {
  title: 'Components/CustomHeader',
  component: CustomHeader,
};

const store = configureStore({
  reducer: () => initialState
});

const BasicComponent = (props) => {
  return (
    <Provider store={store}>
      <CustomHeader {...props} />
    </Provider>
  );
};


export const DefaultHeader = BasicComponent.bind({});