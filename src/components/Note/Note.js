import React, { useEffect, useRef, useContext } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';

import ReplyArea from 'components/Note/ReplyArea';
import NoteContext from 'components/Note/Context';
import NoteContent from 'components/NoteContent';
import selectors from 'selectors';
import core from 'core';

import './Note.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

let currId = 0;

const Note = ({ annotation }) => {
  const { isSelected, resize } = useContext(NoteContext);
  const containerRef = useRef();
  const containerHeightRef = useRef();
  const ids = useRef([]);

  const [noteTransformFunction] = useSelector(
    state => [
      selectors.getNoteTransformFunction(state)
    ],
    shallowEqual,
  );

  useEffect(() => {
    const prevHeight = containerHeightRef.current;
    const currHeight = containerRef.current.getBoundingClientRect().height;
    containerHeightRef.current = currHeight;

    // have a prevHeight check here because we don't want to call resize on mount
    // use Math.round because in some cases in IE11 these two numbers will differ in just 0.00001
    // and we don't want call resize in this case
    if (prevHeight && Math.round(prevHeight) !== Math.round(currHeight)) {
      resize();
    }
  });

  useEffect(() => {
    if (noteTransformFunction) {
      ids.current.forEach(id => {
        const child = document.querySelector(`[data-webviewer-custom-element='${id}']`);
        if (child) {
          child.parentNode.removeChild(child);
        }
      });

      ids.current = [];

      const state = {
        annotation,
        isSelected,
      };

      noteTransformFunction(containerRef.current, state, (...params) => {
        const element = document.createElement(...params);
        const id = `custom-element-${currId}`;
        currId++;
        ids.current.push(id);
        element.setAttribute('data-webviewer-custom-element', id);
        element.addEventListener('mousedown', e => {
          e.stopPropagation();
        });

        return element;
      });
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
        <ReplyArea annotation={annotation} />
      </div>
    </div>
  );
};

Note.propTypes = propTypes;

export default Note;