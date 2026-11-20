import React from 'react';
import { act, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { PRIORITY_ONE } from 'constants/actionPriority';
import useCore from 'hooks/useCore';
import EmbeddedJSPopup from './EmbeddedJSPopup';

jest.mock('hooks/useCore');

describe('EmbeddedJSPopup', () => {
  let documentViewer;

  beforeEach(() => {
    documentViewer = { addEventListener: jest.fn(), removeEventListener: jest.fn() };
    useCore.mockReturnValue({
      core: {
        getDocumentViewer: () => documentViewer,
        getAnnotationManager: () => ({ getFieldManager: () => ({ getField: jest.fn() }) }),
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove and re-add the embeddedPopUpMenu listener when disabled and re-enabled while mounted', () => {
    const store = configureStore({ reducer: rootReducer() });
    render(
      <Provider store={store}>
        <EmbeddedJSPopup />
      </Provider>
    );
    expect(documentViewer.addEventListener).toHaveBeenCalledWith('embeddedPopUpMenu', expect.any(Function));

    act(() => {
      store.dispatch(actions.disableElement(DataElements.EMBEDDED_JS_POPUP, PRIORITY_ONE));
    });
    expect(documentViewer.removeEventListener).toHaveBeenCalledWith('embeddedPopUpMenu', expect.any(Function));

    documentViewer.addEventListener.mockClear();
    act(() => {
      store.dispatch(actions.enableElement(DataElements.EMBEDDED_JS_POPUP, PRIORITY_ONE));
    });
    expect(documentViewer.addEventListener).toHaveBeenCalledWith('embeddedPopUpMenu', expect.any(Function));
  });
});
