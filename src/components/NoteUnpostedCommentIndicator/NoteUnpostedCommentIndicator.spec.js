import React from 'react';
import { render } from '@testing-library/react';
import NoteUnpostedCommentIndicator from './NoteUnpostedCommentIndicator';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

// wrap component with i18n provider, so component can use useTranslation()
const TestNoteUnpostedCommentIndicator = withI18n(NoteUnpostedCommentIndicator);

function createReduxWrapper() {
  const currentState = { viewer: { disabledElements: {} } };
  function rootReducer(state = currentState, action) {
    // eslint-disable-line no-unused-vars
    return state;
  }
  const store = createStore(rootReducer);
  return function ReduxWrapper(props) {
    const { children } = props; // eslint-disable-line react/prop-types
    return <Provider store={store}>{children}</Provider>;
  };
}

describe('NoteUnpostedCommentIndicator component', () => {
  const ReduxWrapper = createReduxWrapper();

  const annotationId = 'one';

  const commentMapWithUnpostedComment = {
    'one': 'Hello',
    'two': undefined,
  };

  const commentMapWithNoUnpostedComment = {
    'one': undefined,
  };

  const replyMapWithUnpostedReply = {
    'one': 'reply',
    'two': undefined,
  };

  const replyMapWithNoUnpostedReply = {
    'one': undefined,
  };

  it('Should not throw errors when rendering', () => {
    expect(() => {
      render(
        <ReduxWrapper>
          <TestNoteUnpostedCommentIndicator
            annotationId={annotationId}
            pendingEditTextMap={commentMapWithNoUnpostedComment}
            pendingReplyMap={replyMapWithUnpostedReply}
          />
        </ReduxWrapper>,
      );
    }).not.toThrow();
  });

  it('Should not render anything if no unposted comment or reply', () => {
    const { container } = render(
      <ReduxWrapper>
        <TestNoteUnpostedCommentIndicator
          annotationId={annotationId}
          pendingEditTextMap={commentMapWithNoUnpostedComment}
          pendingReplyMap={replyMapWithNoUnpostedReply}
        />
      </ReduxWrapper>,
    );
    expect(container.querySelector('.Icon')).not.toBeInTheDocument();
  });

  it('Should render if there is an unposted comment', () => {
    const { container } = render(
      <ReduxWrapper>
        <TestNoteUnpostedCommentIndicator
          annotationId={annotationId}
          pendingEditTextMap={commentMapWithUnpostedComment}
          pendingReplyMap={replyMapWithNoUnpostedReply}
        />
      </ReduxWrapper>,
    );
    expect(container.querySelector('.Icon')).toBeInTheDocument();
  });

  it('Should render if there is an unposted reply', () => {
    const { container } = render(
      <ReduxWrapper>
        <TestNoteUnpostedCommentIndicator
          annotationId={annotationId}
          pendingEditTextMap={commentMapWithNoUnpostedComment}
          pendingReplyMap={replyMapWithUnpostedReply}
        />
      </ReduxWrapper>,
    );
    expect(container.querySelector('.Icon')).toBeInTheDocument();
  });
});
