import { createStore } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import { render } from '@testing-library/react';
import ComparePanel from './ComparePanel';
import core from 'core';

// mock initial state.
// UI Buttons are redux connected, and they need a state or the
// tests will error out
const initialState = {
  viewer: {
    syncViewer: null,
    openElements: {
      comparePanel: true
    },
    panelWidths: {
      comparePanel: 330,
    },
    isInDesktopOnlyMode: false,
    disabledElements: {},
  }
};

function rootReducer(state = initialState, action) { // eslint-disable-line no-unused-vars
  return state;
}

const store = createStore(rootReducer);
const ComparePanelWithRedux = (props) => (
  <Provider store={store}>
    <ComparePanel {...props} />
  </Provider>
);

const noop = () => {
};

jest.mock('core', () => ({
  addEventListener: noop,
  removeEventListener: noop,
  jumpToAnnotation: noop,
  getDocumentViewer: () => ({
    getAnnotationManager: () => ({
      deselectAllAnnotations: noop,
      selectAnnotation: noop,
    })
  })
}));
describe('ComparePanel component', () => {
  it('Should render correctly', () => {
    const { container } = render(<ComparePanelWithRedux/>);
    const searchBar = container.querySelector('.input-container > input');
    const changeList = container.querySelector('.changeList');
    const changeCountTitle = container.querySelector('.changeListTitle');
    expect(searchBar).toBeInTheDocument();
    expect(changeList).toBeInTheDocument();
    expect(changeCountTitle).toBeInTheDocument();
  });
});
