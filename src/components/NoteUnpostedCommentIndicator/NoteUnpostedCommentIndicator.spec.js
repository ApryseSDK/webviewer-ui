import React from 'react';
import { render } from '@testing-library/react';
import NoteUnpostedCommentIndicator from "./NoteUnpostedCommentIndicator";

// wrap component with i18n provider, so component can use useTranslation()
const TestNoteUnpostedCommentIndicator = withI18n(NoteUnpostedCommentIndicator);

describe('NoteUnpostedCommentIndicator component', () => {

  const annotationId = 'one';

  const commentMapWithUnpostedComment = {
    'one': 'Hello',
    'two': undefined
  };

  const commentMapWithNoUnpostedComment = {
    'one': undefined
  };

  const replyMapWithUnpostedReply = {
    'one': 'reply',
    'two': undefined
  };

  const replyMapWithNoUnpostedReply = {
    'one': undefined
  };

  it('Should not throw errors when rendering', () => {
    expect(() => {
      render(<TestNoteUnpostedCommentIndicator
        annotationId={annotationId}
        pendingEditTextMap={commentMapWithNoUnpostedComment}
        pendingReplyMap={replyMapWithUnpostedReply}
      />);
    }).not.toThrow();
  });

  it('Should not render anything if no unposted comment or reply', () => {
    const { container } = render(<TestNoteUnpostedCommentIndicator
      annotationId={annotationId}
      pendingEditTextMap={commentMapWithNoUnpostedComment}
      pendingReplyMap={replyMapWithNoUnpostedReply}
    />);
    expect(container.querySelector('.Icon')).not.toBeInTheDocument();
  })

  it('Should render if there is an unposted comment', () => {
    const { container } = render(<TestNoteUnpostedCommentIndicator
      annotationId={annotationId}
      pendingEditTextMap={commentMapWithUnpostedComment}
      pendingReplyMap={replyMapWithNoUnpostedReply}
    />);
    expect(container.querySelector('.Icon')).toBeInTheDocument();
  })

  it('Should render if there is an unposted reply', () => {
    const { container } = render(<TestNoteUnpostedCommentIndicator
      annotationId={annotationId}
      pendingEditTextMap={commentMapWithNoUnpostedComment}
      pendingReplyMap={replyMapWithUnpostedReply}
    />);
    expect(container.querySelector('.Icon')).toBeInTheDocument();
  })
});
