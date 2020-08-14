import React, { useEffect, useRef, useContext, useState, useCallback } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import NoteContext from 'components/Note/Context';
import NoteContent from 'components/NoteContent';
import ReplyArea from 'components/Note/ReplyArea';

import selectors from 'selectors';
import actions from 'actions';
import core from 'core';

import { createPortal } from 'react-dom';

import './Note.scss';

const Portal = ({ children }) => {
  const mount = document.getElementById("portal-root");
  const el = document.createElement("div");
  el.setAttribute('data-element', 'linePortal');

  useEffect(() => {
    mount.appendChild(el);
    return () => mount.removeChild(el);
  }, [el, mount]);

  return createPortal(children, el);
};

const AnnotationLine = ({ annotation, noteContainerRef }) => {
  const [notePanelWidth, zoom, isLineOpen, isNotesPanelOpen] = useSelector(
    state => [
      selectors.getNotesPanelWidth(state),
      selectors.getZoom(state),
      selectors.isElementOpen(state, 'linePortal'),
      selectors.isElementOpen(state, 'notesPanel'),
    ],
    shallowEqual,
  );
  //For Horizontal Line One
  const [horizontalLineOneWidth, setHorizontalLineOneWidth] = useState(0);
  const [horizontalLineOneTop, setHorizontalLineOneTop] = useState(0);
  const [horizontalLineOneRight, setHorizontalLineOneRight] = useState(0);
  //For Horizontal Line Two
  const [horizontalLineTwoWidth, setHorizontalLineTwoWidth] = useState(0);
  const [horizontalLineTwoTop, setHorizontalLineTwoTop] = useState(0);
  const [horizontalLineTwoRight, setHorizontalLineTwoRight] = useState(0);
  const displayMode = core.getDisplayModeObject();
  const dispatch = useDispatch();

  const { isSelected } = useContext(NoteContext);
  console.log({ zoom });  // console.log( { isLineOpen });
  const pageToWindowCoords  = displayMode.pageToWindow({ x: annotation.getX(), y: annotation.getY() }, 1);
  const { x, y } = pageToWindowCoords;

  useEffect(() => {
    if (isSelected) {
      dispatch(actions.openElement('linePortal'));
    }

    //right is the X
    /// top is the Y
    setHorizontalLineOneRight(notePanelWidth - 16);
    setHorizontalLineOneTop(noteContainerRef.current.getBoundingClientRect().top);
    const lineWidth = window.innerWidth - notePanelWidth - x - annotation.Width + 16;
    setHorizontalLineOneWidth(lineWidth * 0.75);
    setHorizontalLineTwoWidth(lineWidth - horizontalLineOneWidth);

    setHorizontalLineTwoRight(x + annotation.Width);
    setHorizontalLineTwoTop(y + (annotation.Height / 2));

  }, [annotation, displayMode, noteContainerRef, notePanelWidth, x, isNotesPanelOpen, isSelected, dispatch, horizontalLineOneWidth, y]);

  if (isSelected && isLineOpen && isNotesPanelOpen) {
    return (
      <Portal>
        <div className="line" style={{ width: horizontalLineOneWidth, right: horizontalLineOneRight, top: horizontalLineOneTop }}/>
        <div className="line" style={{ width: horizontalLineTwoWidth, left: horizontalLineTwoRight, top: horizontalLineTwoTop }}/>
      </Portal>);
  } else {
    return null;
  }
};

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

let currId = 0;

const Note = ({ annotation }) => {
  const { isSelected, resize } = useContext(NoteContext);
  const containerRef = useRef();
  const containerHeightRef = useRef();
  const [isEditingMap, setIsEditingMap] = useState({});
  const ids = useRef([]);
  const dispatch = useDispatch();

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
    e && e.stopPropagation();

    if (!isSelected) {
      core.deselectAllAnnotations();
      console.log('select ma boa');
      core.selectAnnotation(annotation);
      core.jumpToAnnotation(annotation);
      console.log('open portal');
      setTimeout(() => dispatch(actions.openElement('linePortal'), 300));
      // dispatch(actions.openElement('linePortal'));
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

  const handleNoteKeydown = e => {
    // Click if enter or space is pressed and is current target.
    const isNote = e.target === e.currentTarget;
    if (isNote && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault(); // Stop from being entered in field
      handleNoteClick();
    }
  };

  const setIsEditing = useCallback(
    (isEditing, index) => {
      setIsEditingMap(map => ({
        ...map,
        [index]: isEditing,
      }));
    },
    [setIsEditingMap],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      ref={containerRef}
      className={noteClass}
      onClick={handleNoteClick}
      onKeyDown={handleNoteKeydown}
    >
      <NoteContent
        noteIndex={0}
        annotation={annotation}
        isSelected={isSelected}
        setIsEditing={setIsEditing}
        isEditing={isEditingMap[0]}
      />
      {isSelected && (
        <React.Fragment>
          {replies.length > 0 && <div className="divider" />}
          <div className={repliesClass}>
            {replies.map((reply, i) => (
              <NoteContent
                noteIndex={i + 1}
                key={reply.Id}
                annotation={reply}
                setIsEditing={setIsEditing}
                isEditing={isEditingMap[i + 1]}
              />
            ))}
            {showReplyArea && <ReplyArea annotation={annotation} />}
          </div>
        </React.Fragment>
      )}
      <AnnotationLine annotation={annotation} noteContainerRef={containerRef}/>
    </div>
  );
};

Note.propTypes = propTypes;

export default Note;