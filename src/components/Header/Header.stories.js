import React from 'react';
import Header from './Header';
import initialState from 'src/redux/initialState';
import { createStore, combineReducers } from 'redux';
import { Provider } from "react-redux";
import viewerReducer from 'src/redux/reducers/viewerReducer';

export default {
  title: 'Components/Header',
  component: Header,
};

const reducer = combineReducers({
  viewer: viewerReducer(initialState.viewer)
});

const store = createStore(reducer);

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