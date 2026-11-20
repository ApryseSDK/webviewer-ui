import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import useCore from 'hooks/useCore';
import EmbeddedJSPopupMenu from './EmbeddedJSPopupMenu';

jest.mock('hooks/useCore');

describe('EmbeddedJSPopupMenu', () => {
  beforeEach(() => {
    useCore.mockReturnValue({
      core: {
        getScrollViewElement: () => ({ clientHeight: 500 }),
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderMenu(props) {
    const store = configureStore({ reducer: rootReducer() });
    return render(
      <Provider store={store}>
        <EmbeddedJSPopupMenu
          dataElement="embeddedJSPopup"
          onSelectOption={jest.fn()}
          {...props}
        />
      </Provider>
    );
  }

  it('should render nothing when isSubOpen is false', () => {
    const { container } = renderMenu({ isSubOpen: false, popUpMenuItems: ['Option 1'] });
    expect(container).toBeEmptyDOMElement();
  });

  it('should render nothing when there are no popup menu items', () => {
    const { container } = renderMenu({ isSubOpen: true, popUpMenuItems: [] });
    expect(container).toBeEmptyDOMElement();
  });

  it('should render the menu items when open with items', () => {
    const { getByText } = renderMenu({ isSubOpen: true, popUpMenuItems: ['Option 1', 'Option 2'] });
    expect(getByText('Option 1')).toBeInTheDocument();
    expect(getByText('Option 2')).toBeInTheDocument();
  });

  it('should not throw a hook-order error when a mounted instance goes from open to closed', () => {
    const store = configureStore({ reducer: rootReducer() });
    const { container, getByText, queryByText, rerender } = render(
      <Provider store={store}>
        <EmbeddedJSPopupMenu
          dataElement="embeddedJSPopup"
          onSelectOption={jest.fn()}
          isSubOpen
          popUpMenuItems={['Option 1']}
        />
      </Provider>
    );
    expect(getByText('Option 1')).toBeInTheDocument();

    expect(() => {
      rerender(
        <Provider store={store}>
          <EmbeddedJSPopupMenu
            dataElement="embeddedJSPopup"
            onSelectOption={jest.fn()}
            isSubOpen={false}
            popUpMenuItems={['Option 1']}
          />
        </Provider>
      );
    }).not.toThrow();

    expect(queryByText('Option 1')).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });
});
