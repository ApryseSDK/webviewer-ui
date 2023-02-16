import { createStore } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
const mockAnnotationNoChange = {
  Author: 'author',
  Id: '1',
};
const mockAnnotationNoChangeTwo = {
  Author: 'author',
  Id: '2',
};
const mockChangeListItemData = {
  new: mockAnnotationNoChange,
  newText: mockAnnotationNoChange.Author,
  newCount: mockAnnotationNoChange.Author.length,
  old: mockAnnotationNoChangeTwo,
  oldText: mockAnnotationNoChangeTwo.Author,
  oldCount: mockAnnotationNoChangeTwo.Author.length,
  type: 'Text Content - Edit',
};

const mockAnnotationNoChangeThree = {
  Author: 'author',
  Id: '3',
};
const mockAnnotationNoChangeFour = {
  Author: 'author',
  Id: '4',
};
const mockChangeListItemDataTwo = {
  new: mockAnnotationNoChangeThree,
  newText: mockAnnotationNoChangeThree.Author,
  newCount: mockAnnotationNoChangeThree.Author.length,
  old: mockAnnotationNoChangeFour,
  oldText: mockAnnotationNoChangeFour.Author,
  oldCount: mockAnnotationNoChangeFour.Author.length,
  type: 'Text Content - Edit',
};
const mockSpecialCharAnnotation = {
  Author: 'guest',
  Text: '$$$++',
  Id: '3',
};
const mockChangeListItemDataWithSpecialChar = {
  new: mockSpecialCharAnnotation,
  newText: mockSpecialCharAnnotation.Text,
  newCount: mockSpecialCharAnnotation.Text.length,
  old: mockSpecialCharAnnotation,
  oldText: mockSpecialCharAnnotation.Text,
  oldCount: mockSpecialCharAnnotation.Text.length,
  type: 'Text Content - Edit',
};

const mockDifferentTextAnnotation = {
  Author: 'guest',
  Text: 'helloWorld',
  Id: '3',
};

const mockDifferentTextAnnotationChanged = {
  Author: 'guest',
  Text: 'hello',
  Id: '4',
};

const mockChangeListItemDataWithDifferentText = {
  new: mockDifferentTextAnnotationChanged,
  newText: mockDifferentTextAnnotationChanged.Text,
  newCount: mockDifferentTextAnnotationChanged.Text.length,
  old: mockDifferentTextAnnotation,
  oldText: mockDifferentTextAnnotation.Text,
  oldCount: mockDifferentTextAnnotation.Text.length,
  type: 'Text Content - Edit',
};
const mockAnnotMap = {
  1: [mockChangeListItemData, mockChangeListItemDataTwo],
  2: [mockChangeListItemDataWithSpecialChar],
  4: [mockChangeListItemDataWithDifferentText]
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
    const { container } = render(<ComparePanelWithRedux />);
    const searchBar = container.querySelector('.input-container > input');
    const changeList = container.querySelector('.changeList');
    const changeCountTitle = container.querySelector('.changeListTitle');
    expect(searchBar).toBeInTheDocument();
    expect(changeList).toBeInTheDocument();
    expect(changeCountTitle).toBeInTheDocument();
  });
  it('Should pick up items from window event', function() {
    const { container } = render(<ComparePanelWithRedux />);
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
  it('Should search correct result', function() {
    const { container } = render(<ComparePanelWithRedux />);
    const changeList = container.querySelector('.changeList');
    act(() => {
      window.dispatchEvent(new CustomEvent('compareAnnotationsLoaded', { detail: { annotMap: mockAnnotMap, diffCount: 4 }, bubbles: true, cancelable: true }));
    });
    let changeListItems = changeList.querySelectorAll('.ChangeListItem');
    expect(changeListItems.length).toEqual(4);
    const searchBar = container.querySelector('.input-container > input');
    fireEvent.change(searchBar, { target: { value: '$' } });
    expect(searchBar.value).toBe('$');
    changeListItems = changeList.querySelectorAll('.ChangeListItem');
    expect(changeListItems.length).toEqual(1);
  });

  it('When I click on a Search result it jumps to the right annotations', function() {
    // Mock jest jump to annotation
    core.jumpToAnnotation = jest.fn();

    const { container } = render(<ComparePanelWithRedux />);
    const changeList = container.querySelector('.changeList');
    act(() => {
      window.dispatchEvent(new CustomEvent('compareAnnotationsLoaded', { detail: { annotMap: mockAnnotMap, diffCount: 4 }, bubbles: true, cancelable: true }));
    });
    let changeListItems = changeList.querySelectorAll('.ChangeListItem');
    expect(changeListItems.length).toEqual(4);
    fireEvent.click(changeListItems[0]);
    // expect mock to have been called twice with corect annotation
    expect(core.jumpToAnnotation.mock.calls).toEqual([
      [mockChangeListItemData.old, 1],
      [mockChangeListItemData.new, 2],
    ]);
    core.jumpToAnnotation.mockClear();

    const searchBar = container.querySelector('.input-container > input');
    fireEvent.change(searchBar, { target: { value: 'hello' } });
    expect(searchBar.value).toBe('hello');
    changeListItems = changeList.querySelectorAll('.ChangeListItem');
    expect(changeListItems.length).toEqual(1);
    fireEvent.click(changeListItems[0]);
    expect(core.jumpToAnnotation.mock.calls).toEqual([
      [mockChangeListItemDataWithDifferentText.old, 1],
      [mockChangeListItemDataWithDifferentText.new, 2],
    ]);
  });
});
