import React from 'react';
import rootReducer from 'src/redux/reducers/rootReducer';
import ChangeListItem from './ChangeListItem';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import jumpToAnnotation from 'core/jumpToAnnotation';
import getAnnotationManager from 'core/getAnnotationManager';

jest.mock('core/jumpToAnnotation', () => jest.fn());
jest.mock('core/getAnnotationManager', () => jest.fn());

describe('ChangeListItem', () => {
  let store = null;

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    store = null;
  });

  it('should render without errors', () => {
    expect(() => {
      render(
        <Provider store={store}>
          <ChangeListItem />
        </Provider>
      );
    }).not.toThrow();
  });

  it('should deselect all annotations on both viewers, then select and jump to the new annotations when clicking on the item', () => {
    const mockDeselectAllAnnotations = jest.fn();
    const mockSelectAnnotation = jest.fn();
    getAnnotationManager.mockImplementation(() => ({
      deselectAllAnnotations: mockDeselectAllAnnotations,
      selectAnnotation: mockSelectAnnotation,
    }));

    const props = {
      oldText: 'Old Text',
      newText: 'New Text',
      oldCount: 1,
      newCount: 1,
      type: 'Modification',
      old: { Id: 'old-annotation-id', getPageNumber: () => 3 },
      new: { Id: 'new-annotation-id', getPageNumber: () => 3 },
      selectedAnnotationId: 'old-annotation-id',
    };

    const { getByText } = render(
      <Provider store={store}>
        <ChangeListItem {...props} />
      </Provider>
    );

    fireEvent.click(getByText(props.oldText));

    expect(getAnnotationManager).toHaveBeenCalledWith(1);
    expect(getAnnotationManager).toHaveBeenCalledWith(2);
    expect(mockDeselectAllAnnotations).toHaveBeenCalled();
    expect(mockSelectAnnotation).toHaveBeenCalledWith(props.old);
    expect(mockSelectAnnotation).toHaveBeenCalledWith(props.new);
    expect(jumpToAnnotation).toHaveBeenCalledWith(props.old, 1);
    expect(jumpToAnnotation).toHaveBeenCalledWith(props.new, 2);
  });
});