import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Autolinker from 'autolinker';
import dayjs from 'dayjs';

import ContentArea from 'components/NoteContent/ContentArea';
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
  const [isNoteEditingTriggeredByAnnotationPopup] = useSelector(
    state => [selectors.getIsNoteEditing(state)],
    shallowEqual,
  );
  const { isSelected, searchInput, resize, isContentEditable } = useContext(
    NoteContext,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState(annotation.getContents());
  const [t] = useTranslation();
  const dispatch = useDispatch();

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
      if (transformedContents.includes('<a')) {
        // if searchInput is 't', replace <a ...>text</a> with
        // <a ...><span class="highlight">t</span>ext</a>
        text = transformedContents.replace(
          />(.+)</i,
          (_, p1) => `>${highlightSearchInput(p1, searchInput)}<`,
        );
      } else {
        text = highlightSearchInput(contents, searchInput);
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
  ), [annotation, color, contents, formatNumberOfReplies, icon, isEditing, isReply, noteDateFormat, numberOfReplies, renderAuthorName, renderContents, textAreaValue]);

  const annotationState = annotation.getStatus();

  return useMemo(
    () => (
      <div
        className="NoteContent"
        // to prevent textarea from blurring out during editing when clicking on the note content
        onMouseDown={e => e.preventDefault()}
      >
        <NoteContentHeader
          annotation={annotation}
          setIsEditing={setIsEditing}
        />
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

const NoteContentHeader = ({ annotation, setIsEditing }) => {
  const [sortStrategy, noteDateFormat, iconColor] = useSelector(
    state => [
      selectors.getSortStrategy(state),
      selectors.getNoteDateFormat(state),
      selectors.getIconColor(state, mapAnnotationToKey(annotation)),
    ],
    shallowEqual,
  );
  const { isSelected, searchInput } = useContext(NoteContext);

  const renderAuthorName = useCallback(
    annotation => {
      const name = core.getDisplayAuthor(annotation);

      return name ? (
        <span
          dangerouslySetInnerHTML={{
            __html: highlightSearchInput(name, searchInput),
          }}
        />
      ) : (
        '(no name)'
      );
    },
    [searchInput],
  );

  const isReply = annotation.isReply();
  const icon = getDataWithKey(mapAnnotationToKey(annotation)).icon;
  const color = annotation[iconColor]?.toHexString?.();
  const numberOfReplies = annotation.getReplies().length;

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
      <div className="buttons">
        <div
          className="btn1234"
          onMouseDown={setContents}
        >
          {t('action.save')}
        </div>
        <div
          className="btn1234"
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

NoteContentHeader.propTypes = {
  annotation: PropTypes.object.isRequired,
  setIsEditing: PropTypes.func.isRequired,
};

const highlightSearchInput = (text, searchInput) => {
  if (searchInput.trim()) {
    try {
      text = text.replace(
        new RegExp(`(${searchInput})`, 'gi'),
        '<span class="highlight">$1</span>',
      );
    } catch (e) {
      // this condition is usually met when a search input contains symbols like *?!
      text = text
        .split(searchInput)
        .join(`<span class="highlight">${searchInput}</span>`);
    }
  }

  return text;
};
