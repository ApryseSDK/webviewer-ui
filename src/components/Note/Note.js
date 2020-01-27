import React, { useState, useEffect, useRef, useContext } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import NoteContext from 'components/Note/Context';
import NoteContent from 'components/NoteContent';
import ReplyArea from 'components/Note/ReplyArea';

import core from 'core';

// import React, { useState, useEffect, useRef, useContext } from 'react';
// import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

// import NoteContext from 'components/Note/Context';
import AutoResizeTextarea from 'components/AutoResizeTextarea';

// import core from 'core';
import useDidUpdate from 'hooks/useDidUpdate';
import actions from 'actions';
import selectors from 'selectors';


import './Note.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

const Note = ({ annotation }) => {
  const [
    isNoteEditing,
  ] = useSelector(
    state => [
      selectors.getIsNoteEditing(state),
    ],
    shallowEqual,
  );

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

    if (!isNoteEditing) {
      if (isSelected) {
        core.deselectAnnotation(annotation);
      } else {
        core.deselectAllAnnotations();
        core.selectAnnotation(annotation);
        core.jumpToAnnotation(annotation);
      }
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
    <div
      ref={containerRef}
      className={noteClass}
      onMouseDown={handleNoteClick}
    >
      <NoteContent annotation={annotation} isSelected={isSelected} />
      {isSelected &&
        <React.Fragment>
          {replies.length > 0 && <div className="divider" />}
          <div className={repliesClass}>
            {replies.map(reply => (
              <NoteContent
                key={reply.Id}
                annotation={reply}
                isSelected={isSelected}
              />
            ))}
            <ReplyArea annotation={annotation} />
          </div>
        </React.Fragment>}
    </div>
  );
};

Note.propTypes = propTypes;

export default Note;
