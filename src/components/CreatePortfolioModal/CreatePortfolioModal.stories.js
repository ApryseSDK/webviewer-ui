import React from 'react';
import CreatePortfolioModal from './CreatePortfolioModal';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import DataElements from 'constants/dataElement';

export default {
  title: 'Components/CreatePortfolioModal',
  component: CreatePortfolioModal
};

const getStore = () => {
  const initialState = {
    viewer: {
      openElements: { [DataElements.CREATE_PORTFOLIO_MODAL]: true },
      disabledElements: {},
      tab: { [DataElements.CREATE_PORTFOLIO_MODAL]: DataElements.PORTFOLIO_UPLOAD_FILES_TAB },
      customElementOverrides: {},
    }
  };

  function rootReducer(state = initialState, action) {
    return state;
  }

  return createStore(rootReducer);
};

export function Basic() {
  return (
    <Provider store={getStore()}>
      <CreatePortfolioModal />
    </Provider>
  );
}
