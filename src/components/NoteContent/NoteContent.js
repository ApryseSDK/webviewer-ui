import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
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
import selectors from 'selectors';

import './NoteContent.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

const NoteContent = ({ annotation, isEditing, setIsEditing }) => {
  const [
    noteDateFormat,
    iconColor,
  ] = useSelector(
    state => [
      selectors.getNoteDateFormat(state),
      selectors.getIconColor(state, mapAnnotationToKey(annotation)),
    ],
    shallowEqual,
  );
  const { searchInput } = useContext(
    NoteContext,
  );
  const [textAreaValue, setTextAreaValue] = useState(annotation.getContents());
  const [t] = useTranslation();
  const isReply = annotation.isReply();

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
  const contents = annotation.getContents();
  const numberOfReplies = annotation.getReplies().length;
  const formatNumberOfReplies = Math.min(numberOfReplies, 9);

  const header = useMemo(() => (
    <React.Fragment>
      {!isReply &&
        <div className="type-icon-container">
          {numberOfReplies > 0 &&
            <div className="num-replies-container">
              <div className="num-replies">{formatNumberOfReplies}</div>
            </div>}
          <Icon className="type-icon" glyph={icon} color={color} />
        </div>
      }
      <div className="author-and-date">
        <div className="author-and-overflow">
          {renderAuthorName(annotation)}
          <NotePopup
            annotation={annotation}
            setIsEditing={setIsEditing}
          />
        </div>
        <div className="date-and-time">
          {dayjs(annotation.DateCreated || new Date()).format(noteDateFormat)}
        </div>
        {isEditing ? (
          <ContentArea
            textAreaValue={textAreaValue}
            onTextAreaValueChange={setTextAreaValue}
            annotation={annotation}
            setIsEditing={setIsEditing}
          />
        ) : (
          contents && (
            <div className="container">{renderContents(contents)}</div>
          )
        )}
      </div>
    </React.Fragment>
  ), [annotation, color, contents, formatNumberOfReplies, icon, isEditing, isReply, noteDateFormat, numberOfReplies, renderAuthorName, renderContents, setIsEditing, textAreaValue]);

  const annotationState = annotation.getStatus();

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

  const setContents = () => {
    core.setNoteContents(annotation, textAreaValue);
    if (annotation instanceof window.Annotations.FreeTextAnnotation) {
      core.drawAnnotationsFromList([annotation]);
    }
    setIsEditing(false);
  };

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
      <div className="edit-buttons">
        <div
          className="edit-button"
          onMouseDown={setContents}
        >
          {t('action.save')}
        </div>
        <div
          className="edit-button"
          onMouseDown={() => {
            setIsEditing(false);
            onTextAreaValueChange(contents);
          }}
        >
          {t('action.cancel')}
        </div>
      </div>
    </div>
  );
};

ContentArea.propTypes = {
  annotation: PropTypes.object.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  textAreaValue: PropTypes.string,
  onTextAreaValueChange: PropTypes.func.isRequired,
};
