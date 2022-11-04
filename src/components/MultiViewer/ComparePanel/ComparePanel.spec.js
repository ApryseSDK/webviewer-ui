import { createStore } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import { render } from '@testing-library/react';
import ComparePanel from './ComparePanel';
import DataElements from 'constants/dataElement';
import core from 'core';
import { act } from 'react-dom/test-utils';

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

const noop = () => { };
const mockAnnotation = {
  Author: 'author',
};
const mockChangeListItemData = {
  new: mockAnnotation,
  newText: mockAnnotation.Author,
  newCount: mockAnnotation.Author.length,
  old: mockAnnotation,
  oldText: mockAnnotation.Author,
  oldCount: mockAnnotation.Author.length,
  type: 'Text Content - Edit',
};
const mockAnnotMap = {
  1: [mockChangeListItemData, mockChangeListItemData],
  2: [mockChangeListItemData],
  4: [mockChangeListItemData]
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
  it('Should pick up items from window event', function() {
    const { container } = render(<ComparePanelWithRedux/>);
    act(() => {
      window.dispatchEvent(new CustomEvent('compareAnnotationsLoaded', { detail: { annotMap: mockAnnotMap, diffCount: 4 }, bubbles: true, cancelable: true }));
    });
    const changeList = container.querySelector('.changeList');
    const changeCountTitle = container.querySelector('.changeListTitle');
    expect(changeList).toBeInTheDocument();
    expect(changeCountTitle).toBeInTheDocument();
    expect(changeCountTitle.textContent).toContain(4);
    const changeListItems = changeList.querySelectorAll('.ChangeListItem');
    const changeListPageNumbers = changeList.querySelectorAll('.page-number');
    expect(changeListItems.length).toEqual(4);
    expect(changeListPageNumbers.length).toEqual(3);
  });
});
