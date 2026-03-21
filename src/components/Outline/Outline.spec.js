import React from 'react';
import { render, screen } from '@testing-library/react';
import { Basic, createOutline } from './Outline.stories';
import { shouldExpandOutline } from './Outline';
import Outline from '.';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import actions from 'src/redux/actions';
import { DndProvider } from 'react-dnd';
import OutlineContext from './Context';
import { HTML5Backend } from 'react-dnd-html5-backend';
import userEvent from '@testing-library/user-event';

const BasicOutline = withProviders(Basic);

describe('Outline', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicOutline />);
    }).not.toThrow();
  });

  describe('shouldExpandOutline', () => {
    it('returns true for descendant outline paths', () => {
      expect(shouldExpandOutline('2-5-3', '2')).toBe(true);
    });

    it('returns false when active outline matches exactly with the outline path', () => {
      expect(shouldExpandOutline('2', '2')).toBe(false);
    });

    it('returns false when active outline shares only prefix characters of the outline path', () => {
      expect(shouldExpandOutline('22', '2')).toBe(false);
    });

    it('returns false when active outline is NOT a parent outline', () => {
      expect(shouldExpandOutline('222-223-225', '0')).toBe(false);
    });

    it('returns false when outline path is null', () => {
      expect(shouldExpandOutline('2-1', null)).toBe(false);
    });
  });
});


describe('OutlinesPanel in MultiViewer mode', () => {
  let store;
  const NOOP = () => {};

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false, })
    });
    store.dispatch(actions.setIsMultiViewerMode(true));
    store.dispatch(actions.setActiveDocumentViewerKey(1));
  });

  afterEach(() => {
    store = null;
    jest.clearAllMocks();
  });

  const renderOutline = (store, props, outlineContextProps) => {
    render(
      <Provider store={store}>
        <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
          <div className='left-panel-container' style={{ minWidth: '330px' }}>
            <OutlineContext.Provider
              value={{
                setActiveOutlinePath: NOOP,
                activeOutlinePath: '',
                isOutlineActive: NOOP,
                setIsAddingNewOutline: NOOP,
                selectedOutlines: [],
                outlineScrollParentRef: { current: null },
                ...outlineContextProps,
              }}
            >
              <DndProvider backend={HTML5Backend}>
                <Outline
                  outline={props.outline}
                  setMultiSelected={NOOP}
                  moveOutlineInward={NOOP}
                  moveOutlineBeforeTarget={NOOP}
                  moveOutlineAfterTarget={NOOP}
                  {...props}
                />
              </DndProvider>
            </OutlineContext.Provider>
          </div>
        </div>
      </Provider>
    );
  };

  it('should add outline for the active document viewer', async () => {
    const addNewOutlineSpy = jest.fn();
    const props = {
      outline: createOutline({
        name: 'Lion',
        children: [],
      }),
    };
    renderOutline(store, props, { isAddingNewOutline: true, isOutlineActive: () => true, addNewOutline: addNewOutlineSpy });

    expect(await screen.findByText('Lion')).toBeInTheDocument();
    expect(screen.queryByText('Goat')).not.toBeInTheDocument();
    const addOutlinesButton = await screen.findByRole('button', { name: /Add/i });
    userEvent.click(addOutlinesButton);
    expect(addNewOutlineSpy).toHaveBeenNthCalledWith(1, expect.anything(), 1);

    store.dispatch(actions.setActiveDocumentViewerKey(2));

    userEvent.click(addOutlinesButton);
    expect(addNewOutlineSpy).toHaveBeenNthCalledWith(2, expect.anything(), 2);
    expect(addNewOutlineSpy).toHaveBeenCalledTimes(2);
  });
});
