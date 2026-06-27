import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import NoteUnpostedCommentIndicator from './NoteUnpostedCommentIndicator';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Events from 'constants/events';
import { AUTO_SAVE_INDICATOR_TIMEOUT } from 'src/constants/autosave';

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

  const attachmentMapWithUnpostedItem = {
    'one': [{}],
    'two': undefined
  };

  const attachmentMapWithNoUnpostedItem = {
    'one': undefined
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Should not throw errors when rendering', () => {
    expect(() => {
      render(
        <ReduxWrapper>
          <TestNoteUnpostedCommentIndicator
            annotationId={annotationId}
            pendingEditTextMap={commentMapWithNoUnpostedComment}
            pendingReplyMap={replyMapWithUnpostedReply}
            pendingAttachmentMap={attachmentMapWithUnpostedItem}
          />
        </ReduxWrapper>,
      );
    }).not.toThrow();
  });

  it('Should not render anything if no unposted comment/reply/attachment', () => {
    const { container } = render(
      <ReduxWrapper>
        <TestNoteUnpostedCommentIndicator
          annotationId={annotationId}
          pendingEditTextMap={commentMapWithNoUnpostedComment}
          pendingReplyMap={replyMapWithNoUnpostedReply}
          pendingAttachmentMap={attachmentMapWithNoUnpostedItem}
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
          pendingAttachmentMap={attachmentMapWithNoUnpostedItem}
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
          pendingAttachmentMap={attachmentMapWithNoUnpostedItem}
        />
      </ReduxWrapper>,
    );
    expect(container.querySelector('.Icon')).toBeInTheDocument();
  });

  it('Should render if there is an unposted attachment', () => {
    const { container } = render(
      <ReduxWrapper>
        <TestNoteUnpostedCommentIndicator
          annotationId={annotationId}
          pendingEditTextMap={commentMapWithNoUnpostedComment}
          pendingReplyMap={replyMapWithNoUnpostedReply}
          pendingAttachmentMap={attachmentMapWithUnpostedItem}
        />
      </ReduxWrapper>,
    );
    expect(container.querySelector('.Icon')).toBeInTheDocument();
  });

  it('Should show checkmark for auto save indicator timeout duration after autosave then disappear when nothing is pending', () => {
    const { container } = render(
      <ReduxWrapper>
        <TestNoteUnpostedCommentIndicator
          annotationId={annotationId}
          pendingEditTextMap={commentMapWithNoUnpostedComment}
          pendingReplyMap={replyMapWithNoUnpostedReply}
          pendingAttachmentMap={attachmentMapWithNoUnpostedItem}
        />
      </ReduxWrapper>,
    );

    expect(container.querySelector('.Icon')).not.toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new CustomEvent(Events.NOTE_AUTOSAVED, {
        detail: { annotationId },
      }));
    });

    expect(container.querySelector('.Icon')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(AUTO_SAVE_INDICATOR_TIMEOUT);
    });

    expect(container.querySelector('.Icon')).not.toBeInTheDocument();
  });
});
