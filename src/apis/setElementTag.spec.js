import setElementTag from './setElementTag';
import viewerReducer from 'reducers/viewerReducer';
import { configureStore } from '@reduxjs/toolkit';
import ElementTagTarget from 'constants/elementTagTarget';

describe('UI.setElementTag API', () => {
  let store;
  let originalCheckTypes;
  let originalTypes;

  beforeEach(() => {
    jest.clearAllMocks();
    store = configureStore({
      reducer: viewerReducer({
        elementTags: {
          documentContainer: 'main',
        },
      }),
    });
    jest.spyOn(store, 'dispatch');
    originalCheckTypes = window.Core.checkTypes;
    originalTypes = window.Core.TYPES;
    window.Core.TYPES = {
      STRING: 'string',
      ONE_OF: (...values) => ({
        values: values.length === 1 && Array.isArray(values[0]) ? values[0] : values,
      }),
    };
    window.Core.checkTypes = ([dataElement, tag], [dataElementType, tagType]) => {
      if (!dataElementType.values.includes(dataElement)) {
        throw new Error('Invalid data element');
      }
      if (typeof tag !== tagType) {
        throw new Error('Invalid tag');
      }
    };
  });

  afterEach(() => {
    window.Core.checkTypes = originalCheckTypes;
    window.Core.TYPES = originalTypes;
  });

  it.each(['main', 'div', 'section'])('sets the document container tag to %s', (tag) => {
    setElementTag(store)(ElementTagTarget.DOCUMENT_CONTAINER, tag);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'SET_ELEMENT_TAG',
      payload: { dataElement: ElementTagTarget.DOCUMENT_CONTAINER, tag },
    });
    expect(store.getState().elementTags.documentContainer).toBe(tag);
  });

  it('rejects unsupported data elements', () => {
    expect(() => setElementTag(store)('header', 'div')).toThrow('Invalid data element');
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('rejects non-string tags', () => {
    expect(() => setElementTag(store)(ElementTagTarget.DOCUMENT_CONTAINER, 123)).toThrow('Invalid tag');
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it.each(['', ' ', '\t'])('rejects an empty tag', (tag) => {
    expect(() => setElementTag(store)(ElementTagTarget.DOCUMENT_CONTAINER, tag)).toThrow('tag must be a non-empty string');
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
