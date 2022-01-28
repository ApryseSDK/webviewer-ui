import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { createStore } from "redux";
import { Provider } from "react-redux";
import LeftPanelPageTabsXOD from "components/LeftPanelPageTabs/LeftPanelPageTabsXOD/LeftPanelPageTabsXOD";

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
const LeftPanelPageTabsXODRedux = function(props) {
  return (
    <Provider store={store}>
      <LeftPanelPageTabsXOD {...props} />
    </Provider>
  );
};
function noop() {}

describe('LeftPanelPageTabsXOD', () => {
  describe('Component', () => {
    it('Should render component correctly with all buttons', () => {
      const { container } = render(<LeftPanelPageTabsXODRedux
        onRotateClockwise={noop}
        onRotateCounterClockwise={noop}
      />);

      expect(container.querySelectorAll('.Button')).toHaveLength(2);
    });

    it('Should call each handler when clicked', () => {
      const handlers = {
        onRotateCounterClockwise: {
          fn: jest.fn(),
          dataElement: "thumbnailsControlRotateCounterClockwise"
        },
        onRotateClockwise: {
          fn: jest.fn(),
          dataElement: "thumbnailsControlRotateClockwise"
        },
      };
      const { container } = render(<LeftPanelPageTabsXODRedux
        onRotateCounterClockwise={handlers.onRotateCounterClockwise.fn}
        onRotateClockwise={handlers.onRotateClockwise.fn}
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