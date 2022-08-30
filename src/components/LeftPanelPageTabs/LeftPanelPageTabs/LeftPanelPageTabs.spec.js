import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import LeftPanelPageTabs from 'components/LeftPanelPageTabs/LeftPanelPageTabs/LeftPanelPageTabs';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

// create test component with mock redux
const initialState = {
  viewer: {
    disabledElements: {},
    openElements: [],
    customElementOverrides: []
  },
};
function rootReducer(state = initialState, action) { // eslint-disable-line no-unused-vars
  return state;
}
const store = createStore(rootReducer);
const LeftPanelPageTabsWithRedux = function(props) {
  return (
    <Provider store={store}>
      <LeftPanelPageTabs {...props} />
    </Provider>
  );
};
function noop() {}

describe('LeftPanelPageTabs', () => {
  describe('Component', () => {
    it('Should render component correctly with all buttons', () => {
      const { container } = render(<LeftPanelPageTabsWithRedux
        onReplace={noop()}
        onExtractPages={noop}
        onDeletePages={noop}
        onRotateCounterClockwise={noop}
        onRotateClockwise={noop}
        onInsertAbove={noop}
        onInsertBelow={noop}
      />);

      expect(container.querySelectorAll('.Button')).toHaveLength(8);
    });

    it('Should call each handler when clicked', () => {
      const handlers = {
        onReplace: {
          fn: jest.fn(),
          dataElement: 'thumbnailsControlReplace'
        },
        onExtractPages: {
          fn: jest.fn(),
          dataElement: 'thumbnailsControlExtract'
        },
        onDeletePages: {
          fn: jest.fn(),
          dataElement: 'thumbnailsControlDelete'
        },
        onRotateCounterClockwise: {
          fn: jest.fn(),
          dataElement: 'thumbnailsControlRotateCounterClockwise'
        },
        onRotateClockwise: {
          fn: jest.fn(),
          dataElement: 'thumbnailsControlRotateClockwise'
        },
        onInsertAbove: {
          fn: jest.fn(),
          dataElement: 'thumbnailsControlInsertAbove'
        },
        onInsertBelow: {
          fn: jest.fn(),
          dataElement: 'thumbnailsControlInsertBelow'
        },
      };
      const { container } = render(<LeftPanelPageTabsWithRedux
        onReplace={handlers.onReplace.fn}
        onExtractPages={handlers.onExtractPages.fn}
        onDeletePages={handlers.onDeletePages.fn}
        onRotateCounterClockwise={handlers.onRotateCounterClockwise.fn}
        onRotateClockwise={handlers.onRotateClockwise.fn}
        onInsertAbove={handlers.onInsertAbove.fn}
        onInsertBelow={handlers.onInsertBelow.fn}
      />);

      for (const action in handlers) {
        const button = container.querySelector(`.Button[data-element=${handlers[action].dataElement}]`);
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        expect(handlers[action].fn).toBeCalled();
      }
    });
  });
});