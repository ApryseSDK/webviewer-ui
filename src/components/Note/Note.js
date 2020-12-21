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
import AnnotationNoteConnectorLine from 'components/AnnotationNoteConnectorLine';

import './Note.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

let currId = 0;

const Note = ({
  annotation,
}) => {
  const { isSelected, resize, pendingEditTextMap, setPendingEditText, isContentEditable, isDocumentReadOnly } = useContext(NoteContext);
  const containerRef = useRef();
  const containerHeightRef = useRef();
  const [isEditingMap, setIsEditingMap] = useState({});
  const ids = useRef([]);
  const dispatch = useDispatch();

  const [
    noteTransformFunction,
    customNoteSelectionFunction,
  ] = useSelector(
    state => [
      selectors.getNoteTransformFunction(state),
      selectors.getCustomNoteSelectionFunction(state),
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

  useEffect(() => {
    //If this is not a new one, rebuild the isEditing map
    const pendingText = pendingEditTextMap[annotation.Id]
    if (pendingText !== '' && isContentEditable && !isDocumentReadOnly) {
      setIsEditing(true, 0);
    } else if (isDocumentReadOnly || !isContentEditable) {
      setIsEditing(false, 0);
    }
  }, [isDocumentReadOnly, isContentEditable, setIsEditing, annotation]);

  const handleNoteClick = e => {
    // stop bubbling up otherwise the note will be closed
    // due to annotation deselection
    e && e.stopPropagation();

    if (!isSelected) {
      const currSelection = window.getSelection();
      const focusNode = currSelection.focusNode;
      const selectStart = currSelection.baseOffset;
      const selectEnd = currSelection.extentOffset;

      customNoteSelectionFunction && customNoteSelectionFunction(annotation);
      core.deselectAllAnnotations();
      core.selectAnnotation(annotation);
      core.jumpToAnnotation(annotation);
  
      setTimeout(() => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(focusNode);

        range.setStart(focusNode, selectStart);
        range.setEnd(focusNode, selectEnd);

        selection.removeAllRanges();
        selection.addRange(range);
      }, 0);

      // Need this delay to ensure all other event listeners fire before we open the line
      setTimeout(() => dispatch(actions.openElement('annotationNoteConnectorLine')), 300);
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

  useEffect(() => {
    //Must also restore the isEdit for  any replies, in case someone was editing a
    //reply when a comment was placed above
    replies.forEach((reply, index) => {
      const pendingText = pendingEditTextMap[reply.Id]
      if ((pendingText !== '' && typeof pendingText !== 'undefined') && isSelected) {
        setIsEditing(true, 1 + index);
      }
    })
  }, [isSelected]);

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
        textAreaValue={pendingEditTextMap[annotation.Id]}
        onTextChange={setPendingEditText}
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
                onTextChange={setPendingEditText}
              />
            ))}
            {showReplyArea && <ReplyArea annotation={annotation} />}
          </div>
        </React.Fragment>
      )}
      {
        isSelected && <AnnotationNoteConnectorLine annotation={annotation} noteContainerRef={containerRef} />
      }
    </div>
  );
};

Note.propTypes = propTypes;

export default Note;