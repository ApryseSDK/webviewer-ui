import React from 'react';
import { render } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { Basic, Mobile, initialState } from './InlineCommentingPopup.stories';

const TestInlineCommentPopup = withProviders(Basic);
const TestInlineCommentPopupMobile = withProviders(Mobile);

jest.mock('core', () => ({
  getGroupAnnotations: () => [],
  getDisplayAuthor: () => '',
  canModify: () => true,
  canModifyContents: () => true,
  addEventListener: () => { },
  removeEventListener: () => { },
}));

describe('InlineCommentPopup Component', () => {
  beforeEach(() => {
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    useDispatchMock.mockImplementation(() => { });

    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockImplementation((selector) => selector(initialState));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should not throw any errors when rendering storybook component', () => {
    expect(() => {
      render(<TestInlineCommentPopup />);
    }).not.toThrow();
  });

  it('Should show header for mobile correctly', () => {
    const { container } = render(
      <TestInlineCommentPopupMobile />
    );
    const mobileHeader = container.querySelector('.inline-comment-header');
    expect(mobileHeader).not.toBeNull();
  });
});