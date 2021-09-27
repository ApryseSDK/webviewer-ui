import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { createStore } from "redux";
import { Provider } from "react-redux";
import LeftPanelPageTabsSmall from "components/LeftPanelPageTabs/LeftPanelPageTabsSmall/LeftPanelPageTabsSmall";

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
const LeftPanelPageTabsSmallRedux = function(props) {
  return (
    <Provider store={store}>
      <LeftPanelPageTabsSmall {...props} />
    </Provider>
  );
};
function noop() {}

describe('LeftPanelPageTabsSmall', () => {
  describe('Component', () => {
    it('Should render component correctly with all buttons', () => {
      const { container } = render(<LeftPanelPageTabsSmallRedux
        // TODO: Enable tests for replace
        // onReplace={noop()}
        onExtractPages={noop}
        onDeletePages={noop}
      />);

      expect(container.querySelectorAll('.Button')).toHaveLength(5/*6*/);
    });

    it('Should call each handler when clicked', () => {
      const handlers = {
        // onReplace: {
        //   fn: jest.fn(),
        //   dataElement: "thumbnailsControlReplace"
        // },
        onExtractPages: {
          fn: jest.fn(),
          dataElement: "thumbnailsControlExtract"
        },
        onDeletePages: {
          fn: jest.fn(),
          dataElement: "thumbnailsControlDelete"
        },
      };
      const { container } = render(<LeftPanelPageTabsSmallRedux
        // onReplace={handlers.onReplace.fn}
        onExtractPages={handlers.onExtractPages.fn}
        onDeletePages={handlers.onDeletePages.fn}
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