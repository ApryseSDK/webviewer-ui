import React, { useEffect, useRef, useContext, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import NoteContext from 'components/Note/Context';
import NoteContent from 'components/NoteContent';
import ReplyArea from 'components/Note/ReplyArea';

import core from 'core';

import './Note.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

const Note = ({ annotation }) => {
  const { isSelected, resize } = useContext(NoteContext);
  const containerRef = useRef();
  const containerHeightRef = useRef();
  const [isEditingMap, setIsEditingMap] = useState({});

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

    if (!isSelected) {
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

  const showReplyArea = !Object.values(isEditingMap).some(val => val);
  console.log('showReplyArea', showReplyArea);

  return (
    <div ref={containerRef} className={noteClass} onClick={handleNoteClick}>
      <NoteContent
        annotation={annotation}
        isSelected={isSelected}
        setIsEditing={isEditing => setIsEditingMap(map => ({
          ...map,
          0: isEditing,
        }))}
        isEditing={isEditingMap[0]}
      />
      {isSelected && (
        <React.Fragment>
          {replies.length > 0 && <div className="divider" />}
          <div className={repliesClass}>
            {replies.map((reply, i) => (
              <NoteContent
                key={reply.Id}
                annotation={reply}
                setIsEditing={isEditing => setIsEditingMap(map => ({
                  ...map,
                  [i + 1]: isEditing,
                }))}
                isEditing={isEditingMap[i + 1]}
              />
            ))}
            {showReplyArea && <ReplyArea annotation={annotation} />}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

Note.propTypes = propTypes;

export default Note;
