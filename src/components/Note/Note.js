import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MentionsInput, Mention } from 'react-mentions';

import ReplyArea from 'components/Note/ReplyArea';
import NoteContext from 'components/Note/Context';
import NoteContent from 'components/NoteContent';

import core from 'core';
import selectors from 'selectors';

import './MentionArea.scss';
import './Note.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

const Note = ({ annotation }) => {
  const { isSelected, resize } = useContext(NoteContext);
  const containerRef = useRef();
  const containerHeightRef = useRef();

  useEffect(() => {
    const prevHeight = containerHeightRef.current;
    const currHeight = window.getComputedStyle(containerRef.current).height;

    if (!prevHeight || prevHeight !== currHeight) {
      containerHeightRef.current = currHeight;
      resize();
    }
  });

  const handleNoteClick = e => {
    // stop bubbling up otherwise the note will be closed
    // due to annotation deselection
    e.stopPropagation();

    if (isSelected) {
      core.deselectAnnotation(annotation);
    } else {
      core.deselectAllAnnotations();
      core.selectAnnotation(annotation);
      core.jumpToAnnotation(annotation);
    }
  };

  const noteClass = classNames({
    Note: true,
    expanded: isSelected,
  });

  const repliesClass = classNames({
    replies: true,
    hidden: !isSelected,
  });

  const replies = annotation
    .getReplies()
    .sort((a, b) => a['DateCreated'] - b['DateCreated']);

  return (
    <div ref={containerRef} className={noteClass} onMouseDown={handleNoteClick}>
      <NoteContent annotation={annotation} />
      <div className={repliesClass}>
        {replies.map(reply => (
          <NoteContent key={reply.Id} annotation={reply} />
        ))}
        {/* <ReplyArea annotation={annotation} /> */}
        <MentionsArea />
      </div>
    </div>
  );
};

Note.propTypes = propTypes;

export default Note;

const MentionsArea = () => {
  const userData = useSelector(selectors.getUserData, shallowEqual);
  const [value, setValue] = useState('');

  const handleChange = e => {
    setValue(e.target.value);
  };

  const renderSuggestion = ({ name, email }, search, highlightedDisplay) => (
    <React.Fragment>
      {highlightedDisplay}
      <div className="email">{email}</div>
    </React.Fragment>
  );

  return (
    <div onMouseDown={e => e.stopPropagation()}>
      <MentionsInput
        className="mention"
        value={value}
        onChange={handleChange}
        allowSpaceInQuery
      >
        <Mention
          trigger="@"
          // hack for now to bypass the data instanceof Array check in this library
          data={JSON.parse(JSON.stringify(userData))}
          displayTransform={(_, display) => `@${display}`}
          renderSuggestion={renderSuggestion}
        />
      </MentionsInput>
    </div>
  );
};