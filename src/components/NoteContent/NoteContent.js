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

  const handleContainerClick = useCallback(
    e => {
      if (isSelected) {
        // stop bubbling up otherwise the note will be closed due to annotation deselection
        // when the note is selected, we only want it to be closed when the note content header is clicked
        // because users may try to select text or click any links in contents and we don't want the note to collapse
        // when they are doing that
        e.stopPropagation();
      }
    },
    [isSelected],
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

      return (
        <span className="contents" dangerouslySetInnerHTML={{ __html: text }} />
      );
    },
    [searchInput],
  );

  const annotationState = annotation.getStatus();
  const contents = annotation.getContents();

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
        <div className="content-container" onMouseDown={handleContainerClick}>
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
      </div>
    ),
    [
      annotationState,
      t,
      handleContainerClick,
      isEditing,
      textAreaValue,
      annotation,
      contents,
      renderContents,
    ],
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

  return useMemo(
    () => (
      <div className="title">
        {isReply ? null : (
          <div className="type">
            {icon ? (
              <Icon className="icon" glyph={icon} color={color} />
            ) : (
              annotation.Subject
            )}
          </div>
        )}
        {renderAuthorName(annotation)}
        {(sortStrategy !== 'time' || isSelected || numberOfReplies > 0) && (
          <span className="spacer" />
        )}
        <div className="time">
          {(sortStrategy !== 'time' || isSelected) &&
            dayjs(annotation.DateCreated || new Date()).format(noteDateFormat)}
          {numberOfReplies > 0 && ` (${numberOfReplies})`}
        </div>
        {isSelected && (
          <NotePopup annotation={annotation} setIsEditing={setIsEditing} />
        )}
      </div>
    ),
    [
      annotation,
      color,
      icon,
      isReply,
      isSelected,
      noteDateFormat,
      numberOfReplies,
      renderAuthorName,
      setIsEditing,
      sortStrategy,
    ],
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
