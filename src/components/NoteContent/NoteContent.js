import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Autolinker from 'autolinker';
import dayjs from 'dayjs';

import AutoResizeTextarea from 'components/AutoResizeTextarea';
import NotePopup from 'components/NotePopup';
import NoteContext from 'components/Note/Context';
import Icon from 'components/Icon';

import core from 'core';
import { mapAnnotationToKey, getDataWithKey } from 'constants/map';
import escapeHtml from 'helpers/escapeHtml';
import useDidUpdate from 'hooks/useDidUpdate';
import actions from 'actions';
import selectors from 'selectors';

import './NoteContent.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

const NoteContent = ({ annotation }) => {
  const [
    sortStrategy,
    noteDateFormat,
    iconColor,
    isNoteEditingTriggeredByAnnotationPopup,
  ] = useSelector(
    state => [
      selectors.getSortStrategy(state),
      selectors.getNoteDateFormat(state),
      selectors.getIconColor(state, mapAnnotationToKey(annotation)),
      selectors.getIsNoteEditing(state),
    ],
    shallowEqual,
  );
  const { isSelected, searchInput, resize, isContentEditable } = useContext(
    NoteContext,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState(annotation.getContents());
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const isReply = annotation.isReply();

  useDidUpdate(() => {
    if (!isEditing) {
      dispatch(actions.finishNoteEditing());
    }

    resize();
  }, [isEditing]);

  useEffect(() => {
    // when the comment button in the annotation popup is clicked,
    // this effect will run and we set isEditing to true so that
    // the textarea will be rendered and focused after it is mounted
    if (
      isNoteEditingTriggeredByAnnotationPopup &&
      isSelected &&
      isContentEditable
    ) {
      setIsEditing(true);
    }
  }, [isContentEditable, isNoteEditingTriggeredByAnnotationPopup, isSelected]);

  const renderAuthorName = useCallback(
    annotation => {
      const name = core.getDisplayAuthor(annotation);

      if (!name) {
        return '(no name)';
      }

      return <div className="author-name">{getText(name)}</div>;
    },
    [getText],
  );

  const renderContents = useCallback(
    contents => {
      contents = escapeHtml(contents);

      let text;
      const transformedContents = Autolinker.link(contents, {
        stripPrefix: false,
      });
      const isContentsLinkable = transformedContents.indexOf('<a') !== -1;
      if (isContentsLinkable) {
        // if searchInput is 't', replace <a ...>text</a> with
        // <a ...><span class="highlight">t</span>ext</a>
        text = transformedContents.replace(
          />(.+)</i,
          (_, p1) => `>${getText(p1)}<`,
        );
      } else {
        text = getText(contents);
      }

      return text;
    },
    [getText],
  );

  const getText = useCallback(
    text => {
      if (searchInput.trim()) {
        return text.replace(
          new RegExp(`(${searchInput})`, 'gi'),
          '<span class="highlight">$1</span>',
        );
      }

      return text;
    },
    [searchInput],
  );

  const icon = getDataWithKey(mapAnnotationToKey(annotation)).icon;
  const color = annotation[iconColor]?.toHexString?.();
  const numberOfReplies = annotation.getReplies().length;
  const contents = annotation.getContents();

  const foo =
    <React.Fragment>
      <div>
        {renderAuthorName(annotation)}
        <div className="time">
          {dayjs(annotation.DateCreated || new Date()).format(noteDateFormat)}
        </div>
        {contents && (
          <div className="container">{renderContents(contents)}</div>
        )}
      </div>
      <NotePopup annotation={annotation} setIsEditing={setIsEditing} />
    </React.Fragment>;

  const header = useMemo(() => (
    <div className="title">
      <div className="type">
        {!isReply && <Icon className="icon" glyph={icon} color={color} />}
      </div>
      {foo}
    </div>
  ), [color, foo, icon, isReply]);

  const annotationState = annotation.getStatus();
  const contents2 = annotation.getContents();

  return useMemo(
    () => (
      <div
        className="NoteContent"
        // to prevent textarea from blurring out during editing when clicking on the note content
        onMouseDown={e => e.preventDefault()}
      >
        {header}
        {annotationState && annotationState !== 'None' && (
          <div className="status">
            {t('option.status.status')}: {annotationState}
          </div>
        )}
        {/* <div className="content-container" onMouseDown={handleContainerClick}>
          {isEditing ? (
            <ContentArea
              textAreaValue={textAreaValue}
              onTextAreaValueChange={setTextAreaValue}
              annotation={annotation}
              setIsEditing={setIsEditing}
            />
          ) : (
            contents2 && (
              <div className="container">{renderContents(contents)}</div>
            )
          )}
        </div> */}
      </div>
    ),
    [t, annotationState, header],
  );
};

NoteContent.propTypes = propTypes;

export default NoteContent;

// a component that contains the content textarea, the save button and the cancel button
const ContentArea = ({
  annotation,
  setIsEditing,
  textAreaValue,
  onTextAreaValueChange,
}) => {
  const contents = annotation.getContents();
  const [t] = useTranslation();
  const textareaRef = useRef();

  useEffect(() => {
    // on initial mount, focus the last character of the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();

      const textLength = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(textLength, textLength);
    }
  }, []);

  const setContents = e => {
    // prevent the textarea from blurring out which will unmount these two buttons
    e.preventDefault();

    const hasEdited = textAreaValue !== contents;
    if (hasEdited) {
      core.setNoteContents(annotation, textAreaValue);
      if (annotation instanceof window.Annotations.FreeTextAnnotation) {
        core.drawAnnotationsFromList([annotation]);
      }

      setIsEditing(false);
    }
  };

  const saveBtnClass = classNames({
    disabled: textAreaValue === contents,
  });

  return (
    <div className="edit-content">
      <AutoResizeTextarea
        ref={el => {
          textareaRef.current = el;
        }}
        value={textAreaValue}
        onChange={onTextAreaValueChange}
        onBlur={() => setIsEditing(false)}
        onSubmit={setContents}
        placeholder={`${t('action.comment')}...`}
      />
      <span className="buttons">
        <button className={saveBtnClass} onMouseDown={setContents}>
          {t('action.save')}
        </button>
        <button
          onMouseDown={() => {
            setIsEditing(false);
            onTextAreaValueChange(contents);
          }}
        >
          {t('action.cancel')}
        </button>
      </span>
    </div>
  );
};

ContentArea.propTypes = {
  annotation: PropTypes.object.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  textAreaValue: PropTypes.string,
  onTextAreaValueChange: PropTypes.func.isRequired,
};
