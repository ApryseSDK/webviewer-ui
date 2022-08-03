import React from 'react';
import { render } from '@testing-library/react';
import { createStore } from "redux";
import { Provider } from "react-redux";
import LeftPanelPageTabsSmall from "src/components/LeftPanelPageTabs/LeftPanelPageTabsSmall/LeftPanelPageTabsSmall";

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
const LeftPanelPageTabsSmallRedux = function (props) {
  return (
    <Provider store={store}>
      <LeftPanelPageTabsSmall {...props} />
    </Provider>
  );
};
function noop() { }

describe('LeftPanelPageTabsSmall', () => {
  describe('Component', () => {
    it('Should render component correctly with all buttons', () => {
      const { container } = render(<LeftPanelPageTabsSmallRedux
        onReplace={noop()}
        onExtractPages={noop}
        onDeletePages={noop}
      />);

      expect(container.querySelectorAll('.Button')).toHaveLength(3);
    });
  });
});
