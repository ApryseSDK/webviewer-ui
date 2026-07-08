import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import FloatingHeader from './FloatingHeader';
import useCore from 'hooks/useCore';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import { OPACITY_LEVELS, OPACITY_MODES, PLACEMENT } from 'constants/customizationVariables';

jest.mock('hooks/useCore');

const mockUseCore = useCore;

describe('FloatingHeader', () => {
  let store;
  let scrollViewContainer;

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer(),
    });
    scrollViewContainer = document.createElement('div');
    mockUseCore.mockReturnValue({
      core: {
        getScrollViewElement: () => scrollViewContainer,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    store = null;
    scrollViewContainer = null;
  });

  it('shows page nav on scroll', () => {
    const { container } = render(
      <Provider store={store}>
        <FloatingHeader
          dataElement="page-nav-floating-header"
          placement={PLACEMENT.BOTTOM}
          items={[]}
          opacityMode={OPACITY_MODES.DYANMIC}
          opacity={OPACITY_LEVELS.NONE}
        />
      </Provider>
    );
    let floatingHeader = container.querySelector('.FloatingHeader');
    expect(floatingHeader).toBeInTheDocument();
    expect(floatingHeader).toHaveClass('opacity-none');
    expect(floatingHeader).not.toHaveClass('isVisible');

    floatingHeader = container.querySelector('.FloatingHeader');
    fireEvent.scroll(scrollViewContainer);
    expect(floatingHeader).toHaveClass('isVisible');
  });

  it('shows page nav on scroll when a new scroll listener is added', () => {
    scrollViewContainer = null;
    const { container, rerender } = render(
      <Provider store={store}>
        <FloatingHeader
          dataElement="page-nav-floating-header"
          placement={PLACEMENT.BOTTOM}
          items={[]}
          opacityMode={OPACITY_MODES.DYANMIC}
          opacity={OPACITY_LEVELS.NONE}
        />
      </Provider>
    );
    let floatingHeader = container.querySelector('.FloatingHeader');
    expect(floatingHeader).toBeInTheDocument();
    expect(floatingHeader).toHaveClass('opacity-none');
    expect(floatingHeader).not.toHaveClass('isVisible');

    scrollViewContainer = document.createElement('div');
    rerender(
      <Provider store={store}>
        <FloatingHeader
          dataElement="page-nav-floating-header"
          placement={PLACEMENT.BOTTOM}
          items={[]}
          opacityMode={OPACITY_MODES.DYANMIC}
          opacity={OPACITY_LEVELS.NONE}
        />
      </Provider>
    );

    floatingHeader = container.querySelector('.FloatingHeader');
    expect(floatingHeader).toBeInTheDocument();
    expect(floatingHeader).toHaveClass('opacity-none');
    fireEvent.scroll(scrollViewContainer);
    expect(floatingHeader).toHaveClass('isVisible');
  });
});
