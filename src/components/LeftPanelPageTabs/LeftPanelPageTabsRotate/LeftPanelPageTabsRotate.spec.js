import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import LeftPanelPageTabsRotate from "components/LeftPanelPageTabs/LeftPanelPageTabsRotate/LeftPanelPageTabsRotate";
import withMockRedux from "../../../../jest/withMockRedux";

const LeftPanelPageTabsRotateRedux = withMockRedux(LeftPanelPageTabsRotate);

function noop() {}

describe('LeftPanelPageTabsRotate', () => {
  describe('Component', () => {
    it('Should render component correctly with all buttons', () => {
      const { container } = render(<LeftPanelPageTabsRotateRedux
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
      const { container } = render(<LeftPanelPageTabsRotateRedux
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